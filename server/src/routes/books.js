const express = require('express');
const router = express.Router();
const neo4j = require('neo4j-driver');
const { driver, unwrapInt } = require('../db/driver');

// Routes for `Book` domain model:
// - GET  /api/books?q=...    -> search/list books (by title/author/genre)
// - GET  /api/books/:id      -> book details + ratings + recommendations
// - POST /api/books          -> create a book (deduplicates by title+author)

router.get('/', async (req, res) => {
  const search = req.query.q || '';
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (b:Book)-[:WRITTEN_BY]->(a:Author)
       OPTIONAL MATCH (b)-[:IN_GENRE]->(g:Genre)
       WITH b, a, collect(g.name) AS genres
       WHERE toLower(b.title) CONTAINS toLower($query)
         OR toLower(a.name) CONTAINS toLower($query)
         OR any(x IN genres WHERE toLower(x) CONTAINS toLower($query))
       RETURN b { .title, .summary, .published, genres, id: id(b) } AS book, a.name AS author
       ORDER BY b.title ASC
       LIMIT 50`,
      { query: search }
    );
    // Map Neo4j result records to plain objects used by the API / UI.
    const books = result.records.map((record) => {
      const b = record.get('book');
      return {
        id: unwrapInt(b.id),
        title: b.title,
        summary: b.summary,
        published: b.published,
        genres: b.genres,
        author: record.get('author'),
      };
    });
    res.json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load books' });
  } finally {
    await session.close();
  }
});

router.get('/:id', async (req, res) => {
  const bookId = parseInt(req.params.id, 10);
  console.log('books:get:id ->', bookId);
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (b:Book)
       WHERE id(b) = $id
       OPTIONAL MATCH (b)-[:WRITTEN_BY]->(a:Author)
       OPTIONAL MATCH (b)-[:IN_GENRE]->(g:Genre)
       OPTIONAL MATCH (u:User)-[r:RATED]->(b)
       WITH b, a, collect(g.name) AS genres, collect({ user: u.name, rating: r.rating }) AS ratings
       RETURN b { .title, .summary, .published, genres, id: id(b) } AS book,
              a.name AS author,
              genres,
              ratings`,
      { id: neo4j.int(bookId) }
    );

    console.log('books:get:records', result.records.length);
    if (result.records.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    result.records.forEach((rec, idx) => {
      try { console.log('books:get:rec', idx, rec.get('book')); } catch(e) { console.log('books:get:rec-error', e); }
    });

    // Only the first (and expectedly only) record contains the aggregated book data.
    const record = result.records[0];
    const book = record.get('book');
    const author = record.get('author');
    const genres = record.get('genres');
    const ratings = record.get('ratings');
    if (book && book.id) book.id = unwrapInt(book.id);

    const recommendationsResult = await session.run(
      `MATCH (b:Book)-[:IN_GENRE]->(g:Genre)<-[:IN_GENRE]-(other:Book)
       WHERE id(b) = $bookId AND id(other) <> $bookId
       WITH other, count(g) AS sharedGenres
       ORDER BY sharedGenres DESC, other.title ASC
       LIMIT 5
       RETURN other { .title, .summary, .published, id: id(other) } AS book`,
      { bookId }
    );

    const recommendations = recommendationsResult.records.map((r) => {
      const ob = r.get('book');
      if (ob && ob.id) ob.id = unwrapInt(ob.id);
      return ob;
    });

    res.json({ book, author, ratings, recommendations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load book details' });
  } finally {
    await session.close();
  }
});

router.post('/', async (req, res) => {
  const { title, author, published, genres = [], summary = '' } = req.body;
  if (!title || !author || !published) {
    return res.status(400).json({ message: 'Missing required fields: title, author, published' });
  }

  const session = driver.session();
  try {
    const exists = await session.run(
      `MATCH (b:Book)-[:WRITTEN_BY]->(a:Author)
       WHERE toLower(b.title) = toLower($title) AND toLower(a.name) = toLower($author)
       RETURN b LIMIT 1`,
      { title, author }
    );

    if (exists.records.length > 0) {
      return res.status(409).json({ message: 'Book already exists' });
    }

    await session.run(
      `MERGE (a:Author {name: $author})
       CREATE (b:Book {title: $title, summary: $summary, published: $published})
       CREATE (b)-[:WRITTEN_BY]->(a)`,
      { author, title, summary, published }
    );

    for (const g of genres) {
      if (!g || !g.trim()) continue;
      await session.run(
        `MERGE (gen:Genre {name: $genre})
         MATCH (b:Book {title: $title, published: $published})
         MERGE (b)-[:IN_GENRE]->(gen)`,
        { genre: g.trim(), title, published }
      );
    }

    res.status(201).json({ message: 'Book created' });
  } catch (error) {
    console.error('Failed to create book:', error);
    res.status(500).json({ message: 'Failed to create book' });
  } finally {
    await session.close();
  }
});

module.exports = router;
