import React from 'react';

// Small presentational card used in the books list. This component is
// intentionally simple and stateless: it receives the `book` object and an
// `onSelect` callback to notify the parent when the user clicks a card.
export default function BookCard({ book, onSelect, selected }) {
  return (
    <button
      className={`book-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(book.id)}
      aria-pressed={selected}
    >
      <div className="card-left">
        <div className="cover-placeholder">📘</div>
      </div>
      <div className="card-body">
        <div className="card-title">{book.title}</div>
        <div className="card-meta">{book.author} • {book.published}</div>
        <div className="card-summary">{book.summary}</div>
        <div className="card-genres">{(book.genres || []).join(', ')}</div>
      </div>
    </button>
  );
}
