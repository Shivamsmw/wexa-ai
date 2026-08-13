import React from 'react';
import BookCard from './BookCard';
import FilmCard from './FilmCard';
import Skeleton from './Skeleton';

export default function LibraryList({
  viewType,
  status,
  error,
  booksList,
  filmsList,
  selectedId,
  onSelectBook,
  onSelectFilm,
}) {
  return (
    <aside className="book-list-shell">
      <div className="list-header">
        <h2>{viewType === 'books' ? 'Books' : 'Films'}</h2>
        <div className="list-sub">Browse and explore relationships</div>
      </div>

      {status === 'loading' && (
        <div className="book-list">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card-skeleton">
              <Skeleton height={96} width={76} style={{ borderRadius: 12 }} />
              <div style={{ flex: 1, marginLeft: 12 }}>
                <Skeleton height={18} width="60%" />
                <Skeleton height={14} width="40%" style={{ marginTop: 8 }} />
                <Skeleton height={12} width="90%" style={{ marginTop: 12 }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="message error">{error}</div>}

      {status === 'success' && viewType === 'books' && booksList.length === 0 && (
        <div className="message">No books match your search.</div>
      )}
      {status === 'success' && viewType === 'films' && filmsList.length === 0 && (
        <div className="message">No films match your search.</div>
      )}

      <div className="book-list">
        {viewType === 'books' && booksList.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            selected={selectedId === book.id}
            onSelect={onSelectBook}
          />
        ))}

        {viewType === 'films' && filmsList.map((film) => (
          <FilmCard
            key={film.id}
            film={film}
            selected={selectedId === film.id}
            onSelect={onSelectFilm}
          />
        ))}
      </div>
    </aside>
  );
}
