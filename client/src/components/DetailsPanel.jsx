import React from 'react';

export default function DetailsPanel({ viewType, selectedBook, selectedFilm }) {
  if (viewType === 'books') {
    return (
      <section className="details-panel modern">
        {!selectedBook && <div className="message">Select a book to see details and recommendations.</div>}
        {selectedBook && (
          <div className="details-inner">
            <div className="meta-row">
              <div className="cover-large">📘</div>
              <div>
                <h2 className="detail-title">{selectedBook.book.title}</h2>
                <div className="book-meta">By {selectedBook.author} • {selectedBook.book.published}</div>
                <div className="genres">{selectedBook.book.genres.join(', ')}</div>
              </div>
            </div>
            <p className="detail-summary">{selectedBook.book.summary}</p>

            <div className="ratings-shell">
              <h3>User ratings</h3>
              {selectedBook.ratings.length === 0 ? (
                <p>No ratings yet.</p>
              ) : (
                <ul>
                  {selectedBook.ratings.map((rating, idx) => (
                    <li key={idx}>{rating.user}: {rating.rating} ⭐</li>
                  ))}
                </ul>
              )}
            </div>

            <div className="recommendations-shell">
              <h3>Recommended similar books</h3>
              {selectedBook.recommendations.length === 0 ? (
                <p>No similar books found.</p>
              ) : (
                <ul>
                  {selectedBook.recommendations.map((book) => (
                    <li key={book.id}>{book.title}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="details-panel modern">
      {!selectedFilm && <div className="message">Select a film to see details.</div>}
      {selectedFilm && (
        <div className="details-inner">
          <div className="meta-row">
            <div className="cover-large">🎬</div>
            <div>
              <h2 className="detail-title">{selectedFilm.title}</h2>
              <div className="book-meta">Directed by {selectedFilm.director} • {selectedFilm.published}</div>
              <div className="genres">{(selectedFilm.genres || []).join(', ')}</div>
            </div>
          </div>
          <p className="detail-summary">{selectedFilm.summary}</p>
        </div>
      )}
    </section>
  );
}
