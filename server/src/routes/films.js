const express = require('express');
const router = express.Router();
const { driver, unwrapInt } = require('../db/driver');

// Simple Films API. The implementation mirrors the Books API pattern:
// - List films with optional client-side search
// - Create films with deduplication by title+published year

router.get('/', async (req, res) => {
  const search = req.query.q || '';
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (f:Film)-[:DIRECTED_BY]->(d:Director)
       OPTIONAL MATCH (f)-[:IN_GENRE]->(g:Genre)
       WITH f, d, collect(g.name) AS genres
       RETURN f { .title, .summary, .published, id: id(f) } AS film, d.name AS director, genres
       ORDER BY f.published DESC
       LIMIT 500`
    );

    // Convert Neo4j records into plain JS objects expected by the client
    let films = result.records.map((r) => {
      const f = r.get('film');
      if (f && f.id) f.id = unwrapInt(f.id);
      return {
        id: f.id,
        title: f.title,
        summary: f.summary,
        published: f.published,
        director: r.get('director'),
        genres: r.get('genres')
      };
    });

    // simple client-side search by title/director/genre
    if (search) {
      const q = search.toLowerCase();
      films = films.filter(f => (f.title || '').toLowerCase().includes(q) || (f.director || '').toLowerCase().includes(q) || (f.genres||[]).join(' ').toLowerCase().includes(q));
    }

    res.json({ films });
  } catch (error) {
    console.error('Failed to list films:', error);
    res.status(500).json({ message: 'Failed to list films' });
  } finally {
    await session.close();
  }
});

router.post('/', async (req, res) => {
  const { title, director, published, genres = [], summary = '' } = req.body;
  if (!title || !director || !published) {
    return res.status(400).json({ message: 'Missing required fields: title, director, published' });
  }

  const session = driver.session();
  try {
    const existsResult = await session.run(
      `MATCH (f:Film)
       WHERE toLower(f.title) = toLower($title) AND f.published = $published
       RETURN f LIMIT 1`,
      { title, published }
    );

    if (existsResult.records.length > 0) {
      return res.status(409).json({ message: 'Film already exists' });
    }

    await session.run(
      `MERGE (d:Director {name: $director})
       CREATE (f:Film {title: $title, summary: $summary, published: $published})
       CREATE (f)-[:DIRECTED_BY]->(d)`,
      { director, title, summary, published }
    );

    for (const g of genres) {
      if (!g || !g.trim()) continue;
      await session.run(
        `MERGE (gen:Genre {name: $genre})
         MATCH (f:Film {title: $title, published: $published})
         MERGE (f)-[:IN_GENRE]->(gen)`,
        { genre: g.trim(), title, published }
      );
    }

    res.status(201).json({ message: 'Film created' });
  } catch (error) {
    console.error('Failed to create film:', error);
    res.status(500).json({ message: 'Failed to create film' });
  } finally {
    await session.close();
  }
});

module.exports = router;
