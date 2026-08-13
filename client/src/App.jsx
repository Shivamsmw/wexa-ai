import React from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import CreatePanel from './components/CreatePanel';
import LibraryList from './components/LibraryList';
import DetailsPanel from './components/DetailsPanel';
import useLibraryState from './hooks/useLibraryState';

export default function App() {
  const {
    query,
    setQuery,
    handleSearch,
    viewType,
    setViewType,
    theme,
    toggleTheme,
    showAddFilm,
    showAddBook,
    toggleAddFilm,
    toggleAddBook,
    closeFilmForm,
    closeBookForm,
    filmForm,
    bookForm,
    setFilmField,
    setBookField,
    handleAddFilm,
    handleAddBook,
    filmMsg,
    bookMsg,
    isAddingFilm,
    isAddingBook,
    booksList,
    filmsList,
    selectedId,
    selectedBook,
    selectedFilm,
    status,
    error,
    selectBook,
    selectFilm,
  } = useLibraryState();

  return (
    <div className={`page-shell ${theme}-theme`}>
      <Header />

      <section className="controls">
        <ControlPanel
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          viewType={viewType}
          onSetViewType={setViewType}
          theme={theme}
          onToggleTheme={toggleTheme}
          showAddFilm={showAddFilm}
          showAddBook={showAddBook}
          onToggleAddFilm={toggleAddFilm}
          onToggleAddBook={toggleAddBook}
        />

        <CreatePanel
          showAddFilm={showAddFilm}
          showAddBook={showAddBook}
          filmForm={filmForm}
          bookForm={bookForm}
          onFilmFieldChange={setFilmField}
          onBookFieldChange={setBookField}
          onAddFilm={handleAddFilm}
          onAddBook={handleAddBook}
          filmMsg={filmMsg}
          bookMsg={bookMsg}
          isAddingFilm={isAddingFilm}
          isAddingBook={isAddingBook}
          onCloseFilm={closeFilmForm}
          onCloseBook={closeBookForm}
        />
      </section>

      <main className="layout modern">
        <LibraryList
          viewType={viewType}
          status={status}
          error={error}
          booksList={booksList}
          filmsList={filmsList}
          selectedId={selectedId}
          onSelectBook={selectBook}
          onSelectFilm={selectFilm}
        />

        <DetailsPanel
          viewType={viewType}
          selectedBook={selectedBook}
          selectedFilm={selectedFilm}
        />
      </main>
    </div>
  );
}
