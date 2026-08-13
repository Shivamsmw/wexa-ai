import React from 'react';

export default function ControlPanel({
  query,
  onQueryChange,
  onSearch,
  viewType,
  onSetViewType,
  theme,
  onToggleTheme,
  showAddFilm,
  showAddBook,
  onToggleAddFilm,
  onToggleAddBook,
}) {
  return (
    <div className="controls">
      <form onSubmit={onSearch} className="search-form">
        <label htmlFor="search">Search books, authors, genres</label>
        <div className="search-row">
          <input
            id="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Try 'Fantasy' or 'Sanderson'"
          />
          <button type="submit" className="btn-primary">
            Search
          </button>
        </div>
      </form>

      <div className="add-film-shell" style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="btn-primary" onClick={onToggleAddFilm}>
            {showAddFilm ? 'Cancel Film' : 'Add Film'}
          </button>
          <button type="button" className="btn-primary" onClick={onToggleAddBook}>
            {showAddBook ? 'Cancel Book' : 'Add Book'}
          </button>
        </div>

        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <label style={{ marginRight: 8 }}>View:</label>
          <button
            type="button"
            className={viewType === 'books' ? 'btn-primary active' : 'btn-secondary'}
            onClick={() => onSetViewType('books')}
          >
            Books
          </button>
          <button
            type="button"
            className={viewType === 'films' ? 'btn-primary active' : 'btn-secondary'}
            onClick={() => onSetViewType('films')}
          >
            Films
          </button>
          <button type="button" className="btn-secondary theme-toggle" onClick={onToggleTheme}>
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>
    </div>
  );
}
