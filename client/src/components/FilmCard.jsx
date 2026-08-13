import React from 'react';

// Presentational card for films. Matches the book card layout so the
// list has a consistent look and feel across both content types.
export default function FilmCard({ film, selected, onSelect }) {
  return (
    <button
      type="button"
      className={`film-card ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(film)}
      aria-pressed={selected}
    >
      <div className="cover-small">🎬</div>
      <div className="film-card-body">
        <div className="title-row">
          <strong>{film.title}</strong>
          <span className="muted">({film.published})</span>
        </div>
        <div className="meta-row-small">Directed by {film.director}</div>
        <div className="genres">{(film.genres || []).join(', ')}</div>
      </div>
    </button>
  );
}
