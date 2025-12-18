import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

const initialState = {
  theme: typeof window !== 'undefined' ? (localStorage.getItem('theme') || 'dark') : 'dark',
  user: null,
  events: typeof window !== 'undefined' && localStorage.getItem('events')
    ? JSON.parse(localStorage.getItem('events'))
    : [
        {
          id: 1,
          title: 'Tech Conference 2025',
          description: 'Join us for an exciting day of talks, workshops, and networking.',
          date: '2025-01-15',
          time: '09:00',
          location: 'San Francisco Convention Center',
          capacity: 500,
          attending: 342,
          organizer: 'Tech Events Inc.',
        },
      ],
};

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_THEME': {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      return { ...state, theme: next };
    }
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_EVENT':
      return { ...state, events: [action.payload, ...state.events] };
    case 'EDIT_EVENT':
      return { ...state, events: state.events.map(ev => (ev.id === action.payload.id ? action.payload : ev)) };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(ev => ev.id !== action.payload) };
    case 'RSVP':
      return {
        ...state,
        events: state.events.map(ev => (ev.id === action.payload ? { ...ev, attending: ev.attending + 1 } : ev)),
      };
    case 'CANCEL_RSVP':
      return {
        ...state,
        events: state.events.map(ev => (ev.id === action.payload ? { ...ev, attending: Math.max(0, ev.attending - 1) } : ev)),
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem('theme', state.theme);
      localStorage.setItem('events', JSON.stringify(state.events));
    } catch (e) {
      // ignore
    }
    const html = document.documentElement;
    if (state.theme === 'dark') html.classList.add('dark'); else html.classList.remove('dark');
  }, [state.theme, state.events]);

  const value = {
    theme: state.theme,
    user: state.user,
    events: state.events,
    toggleTheme: () => dispatch({ type: 'TOGGLE_THEME' }),
    setTheme: t => dispatch({ type: 'SET_THEME', payload: t }),
    login: user => dispatch({ type: 'LOGIN', payload: user }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    addEvent: ev => dispatch({ type: 'ADD_EVENT', payload: ev }),
    editEvent: ev => dispatch({ type: 'EDIT_EVENT', payload: ev }),
    deleteEvent: id => dispatch({ type: 'DELETE_EVENT', payload: id }),
    rsvp: id => dispatch({ type: 'RSVP', payload: id }),
    cancelRsvp: id => dispatch({ type: 'CANCEL_RSVP', payload: id }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export default AppContext;
