import { useReducer, useEffect, useMemo, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://cognodb-assignment-shivam-backend.onrender.com';

const initialFormState = {
  title: '',
  author: '',
  director: '',
  year: '',
  genres: '',
};

const initialState = {
  query: '',
  searchTerm: '',
  viewType: 'books',
  selectedId: null,
  selectedFilm: null,
  showAddFilm: false,
  showAddBook: false,
  filmForm: { ...initialFormState },
  bookForm: { ...initialFormState },
  filmMsg: null,
  bookMsg: null,
  theme:
    typeof window !== 'undefined'
      ? localStorage.getItem('theme') || 'dark'
      : 'dark',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_QUERY':
      return { ...state, query: action.payload };

    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };

    case 'SET_VIEW_TYPE':
      return {
        ...state,
        viewType: action.payload,
        selectedId: null,
        selectedFilm: null,
      };

    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedId: null,
        selectedFilm: null,
      };

    case 'SET_SELECTED_BOOK':
      return {
        ...state,
        selectedId: action.payload,
        selectedFilm: null,
      };

    case 'SET_SELECTED_FILM':
      return {
        ...state,
        selectedId: action.payload.id,
        selectedFilm: action.payload,
      };

    case 'SET_SHOW_ADD_FILM':
      return {
        ...state,
        showAddFilm: action.payload,
      };

    case 'SET_SHOW_ADD_BOOK':
      return {
        ...state,
        showAddBook: action.payload,
      };

    case 'SET_FILM_FIELD':
      return {
        ...state,
        filmForm: {
          ...state.filmForm,
          [action.field]: action.value,
        },
      };

    case 'SET_BOOK_FIELD':
      return {
        ...state,
        bookForm: {
          ...state.bookForm,
          [action.field]: action.value,
        },
      };

    case 'SET_FILM_MSG':
      return {
        ...state,
        filmMsg: action.payload,
      };

    case 'SET_BOOK_MSG':
      return {
        ...state,
        bookMsg: action.payload,
      };

    case 'RESET_FILM_FORM':
      return {
        ...state,
        filmForm: { ...initialFormState },
        filmMsg: null,
      };

    case 'RESET_BOOK_FORM':
      return {
        ...state,
        bookForm: { ...initialFormState },
        bookMsg: null,
      };

    default:
      return state;
  }
}

export default function useLibraryState() {
  const [ui, dispatch] = useReducer(reducer, initialState);
  const queryClient = useQueryClient();

  const booksQuery = useQuery({
    queryKey: ['books', ui.searchTerm],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/books?q=${encodeURIComponent(ui.searchTerm)}`
      );

      if (!response.ok) {
        throw new Error('Unable to fetch books');
      }

      return response.json();
    },
    enabled: ui.viewType === 'books',
    keepPreviousData: true,
    staleTime: 10000,
  });

  const filmsQuery = useQuery({
    queryKey: ['films', ui.searchTerm],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/films?q=${encodeURIComponent(ui.searchTerm)}`
      );

      if (!response.ok) {
        throw new Error('Unable to fetch films');
      }

      return response.json();
    },
    enabled: ui.viewType === 'films',
    keepPreviousData: true,
    staleTime: 10000,
  });

  const bookDetailQuery = useQuery({
    queryKey: ['book', ui.selectedId],
    queryFn: async () => {
      const response = await fetch(
        `${API_URL}/api/books/${ui.selectedId}`
      );

      if (!response.ok) {
        throw new Error('Unable to load book details');
      }

      return response.json();
    },
    enabled: ui.selectedId != null && ui.viewType === 'books',
    staleTime: 10000,
  });

  const addBookMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to add book');
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(['books']);
    },
  });

  const addFilmMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch(`${API_URL}/api/films`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Failed to add film');
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries(['films']);
    },
  });

  useEffect(() => {
    localStorage.setItem('theme', ui.theme);
    document.body.classList.toggle(
      'theme-light',
      ui.theme === 'light'
    );
  }, [ui.theme]);

  const handleSearch = useCallback(
    (event) => {
      event.preventDefault();

      dispatch({
        type: 'SET_SEARCH_TERM',
        payload: ui.query,
      });

      dispatch({
        type: 'CLEAR_SELECTION',
      });
    },
    [ui.query]
  );

  const setQuery = useCallback((value) => {
    dispatch({
      type: 'SET_QUERY',
      payload: value,
    });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({
      type: 'TOGGLE_THEME',
    });
  }, []);

  const setViewType = useCallback((type) => {
    dispatch({
      type: 'SET_VIEW_TYPE',
      payload: type,
    });
  }, []);

  const selectBook = useCallback((id) => {
    dispatch({
      type: 'SET_SELECTED_BOOK',
      payload: id,
    });
  }, []);

  const selectFilm = useCallback((film) => {
    dispatch({
      type: 'SET_SELECTED_FILM',
      payload: film,
    });
  }, []);

  const toggleAddFilm = useCallback(() => {
    dispatch({
      type: 'SET_SHOW_ADD_FILM',
      payload: !ui.showAddFilm,
    });

    dispatch({
      type: 'SET_FILM_MSG',
      payload: null,
    });
  }, [ui.showAddFilm]);

  const toggleAddBook = useCallback(() => {
    dispatch({
      type: 'SET_SHOW_ADD_BOOK',
      payload: !ui.showAddBook,
    });

    dispatch({
      type: 'SET_BOOK_MSG',
      payload: null,
    });
  }, [ui.showAddBook]);

  const closeFilmForm = useCallback(() => {
    dispatch({
      type: 'SET_SHOW_ADD_FILM',
      payload: false,
    });

    dispatch({
      type: 'RESET_FILM_FORM',
    });
  }, []);

  const closeBookForm = useCallback(() => {
    dispatch({
      type: 'SET_SHOW_ADD_BOOK',
      payload: false,
    });

    dispatch({
      type: 'RESET_BOOK_FORM',
    });
  }, []);

  const setFilmField = useCallback((field, value) => {
    dispatch({
      type: 'SET_FILM_FIELD',
      field,
      value,
    });
  }, []);

  const setBookField = useCallback((field, value) => {
    dispatch({
      type: 'SET_BOOK_FIELD',
      field,
      value,
    });
  }, []);

  const handleAddFilm = useCallback(
    async (event) => {
      event.preventDefault();

      dispatch({
        type: 'SET_FILM_MSG',
        payload: null,
      });

      const genres = ui.filmForm.genres
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (
        !ui.filmForm.title ||
        !ui.filmForm.director ||
        !ui.filmForm.year
      ) {
        dispatch({
          type: 'SET_FILM_MSG',
          payload: {
            type: 'error',
            text: 'Title, director and year are required',
          },
        });

        return;
      }

      try {
        await addFilmMutation.mutateAsync({
          title: ui.filmForm.title,
          director: ui.filmForm.director,
          published: parseInt(ui.filmForm.year, 10),
          genres,
          summary: '',
        });

        dispatch({
          type: 'SET_FILM_MSG',
          payload: {
            type: 'success',
            text: 'Film added successfully',
          },
        });

        dispatch({
          type: 'RESET_FILM_FORM',
        });
      } catch (err) {
        dispatch({
          type: 'SET_FILM_MSG',
          payload: {
            type: 'error',
            text: err.message,
          },
        });
      }
    },
    [ui.filmForm, addFilmMutation]
  );

  const handleAddBook = useCallback(
    async (event) => {
      event.preventDefault();

      dispatch({
        type: 'SET_BOOK_MSG',
        payload: null,
      });

      const genres = ui.bookForm.genres
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

      if (
        !ui.bookForm.title ||
        !ui.bookForm.author ||
        !ui.bookForm.year
      ) {
        dispatch({
          type: 'SET_BOOK_MSG',
          payload: {
            type: 'error',
            text: 'Title, author and year are required',
          },
        });

        return;
      }

      try {
        await addBookMutation.mutateAsync({
          title: ui.bookForm.title,
          author: ui.bookForm.author,
          published: parseInt(ui.bookForm.year, 10),
          genres,
          summary: '',
        });

        dispatch({
          type: 'SET_BOOK_MSG',
          payload: {
            type: 'success',
            text: 'Book added successfully',
          },
        });

        dispatch({
          type: 'RESET_BOOK_FORM',
        });
      } catch (err) {
        dispatch({
          type: 'SET_BOOK_MSG',
          payload: {
            type: 'error',
            text: err.message,
          },
        });
      }
    },
    [ui.bookForm, addBookMutation]
  );

  return {
    ...ui,

    booksList: useMemo(
      () => booksQuery.data?.books || [],
      [booksQuery.data]
    ),

    filmsList: useMemo(
      () => filmsQuery.data?.films || [],
      [filmsQuery.data]
    ),

    selectedBook: bookDetailQuery.data,

    status:
      ui.viewType === 'books'
        ? booksQuery.status
        : filmsQuery.status,

    error:
      booksQuery.error?.message ||
      filmsQuery.error?.message ||
      bookDetailQuery.error?.message,

    isAddingBook: addBookMutation.isLoading,
    isAddingFilm: addFilmMutation.isLoading,

    handleSearch,
    setQuery,
    toggleTheme,
    setViewType,
    selectBook,
    selectFilm,
    toggleAddFilm,
    toggleAddBook,
    closeFilmForm,
    closeBookForm,
    setFilmField,
    setBookField,
    handleAddFilm,
    handleAddBook,
    dispatch,
  };
}