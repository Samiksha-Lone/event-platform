import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext(null);

// Helper function to normalize event IDs
const normalizeEventId = (event) => {
  let id = event.id;
  
  // If no id, try to get from _id
  if (!id && event._id) {
    id = typeof event._id === 'string' ? event._id : event._id.toString();
  }
  
  // If still no id, generate one
  if (!id) {
    id = Math.random().toString(36).substr(2, 9);
  }
  
  return {
    ...event,
    id: id,
  };
};

const normalizeEvents = (events) => events.map(normalizeEventId);

const initialState = {
  user: null,
  events: typeof window !== 'undefined' && localStorage.getItem('events')
    ? normalizeEvents(JSON.parse(localStorage.getItem('events')))
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
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'ADD_EVENT': {
      const event = action.payload;
      const normalizedEvent = normalizeEventId(event);
      return { ...state, events: [normalizedEvent, ...state.events] };
    }
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

  // Save events to localStorage when they change
  useEffect(() => {
    try {
      const normalizedEvents = normalizeEvents(state.events);
      localStorage.setItem('events', JSON.stringify(normalizedEvents));
    } catch (e) {
      console.error('Error saving events:', e);
    }
  }, [state.events]);

  const value = {
    user: state.user,
    events: state.events,
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export default AppContext;
