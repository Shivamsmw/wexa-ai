import React from 'react';

function Message({ message }) {
  if (!message) return null;
  return <div className={message.type === 'error' ? 'message error' : 'message info'} style={{ marginTop: 8 }}>{message.text}</div>;
}

export default function CreatePanel({
  showAddFilm,
  showAddBook,
  filmForm,
  bookForm,
  onFilmFieldChange,
  onBookFieldChange,
  onAddFilm,
  onAddBook,
  filmMsg,
  bookMsg,
  isAddingFilm,
  isAddingBook,
  onCloseFilm,
  onCloseBook,
}) {
  return (
    <div className="add-film-shell" style={{ display: 'grid', gap: 8 }}>
      {showAddFilm && (
        <form className="add-film-form" onSubmit={onAddFilm}>
          <input placeholder="Title" value={filmForm.title} onChange={(e) => onFilmFieldChange('title', e.target.value)} />
          <input placeholder="Director" value={filmForm.director} onChange={(e) => onFilmFieldChange('director', e.target.value)} />
          <input placeholder="Year" value={filmForm.year} onChange={(e) => onFilmFieldChange('year', e.target.value)} />
          <input placeholder="Genres (comma separated)" value={filmForm.genres} onChange={(e) => onFilmFieldChange('genres', e.target.value)} />

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="submit" className="btn-primary" disabled={isAddingFilm}>
              {isAddingFilm ? 'Adding film…' : 'Create'}
            </button>
            <button type="button" onClick={onCloseFilm} disabled={isAddingFilm}>
              Close
            </button>
          </div>

          <Message message={filmMsg} />
        </form>
      )}

      {showAddBook && (
        <form className="add-film-form" onSubmit={onAddBook}>
          <input placeholder="Title" value={bookForm.title} onChange={(e) => onBookFieldChange('title', e.target.value)} />
          <input placeholder="Author" value={bookForm.author} onChange={(e) => onBookFieldChange('author', e.target.value)} />
          <input placeholder="Year" value={bookForm.year} onChange={(e) => onBookFieldChange('year', e.target.value)} />
          <input placeholder="Genres (comma separated)" value={bookForm.genres} onChange={(e) => onBookFieldChange('genres', e.target.value)} />

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button type="submit" className="btn-primary" disabled={isAddingBook}>
              {isAddingBook ? 'Adding book…' : 'Create Book'}
            </button>
            <button type="button" onClick={onCloseBook} disabled={isAddingBook}>
              Close
            </button>
          </div>

          <Message message={bookMsg} />
        </form>
      )}
    </div>
  );
}
