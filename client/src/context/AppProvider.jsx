import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import { api } from '../utils/api';

const AppContext = createContext(null);

// Backend base URL is configured in src/utils/api.js (API_BASE_URL)

// Normalize event IDs
const normalizeEventId = (event) => {
  let id = event.id;

  if (!id && event._id) {
    id = typeof event._id === 'string' ? event._id : event._id.toString();
  }

  if (!id) {
    id = Math.random().toString(36).substr(2, 9);
  }

  return {
    ...event,
    id,
  };
};

const normalizeEvents = (events = []) => events.map(normalizeEventId);

const initialState = {
  user: null,
  events:
    typeof window !== 'undefined' && localStorage.getItem('events')
      ? normalizeEvents(JSON.parse(localStorage.getItem('events')))
      : [
          {
            id: 'seed-1',
            title: 'Tech Conference 2025',
            description:
              'Join us for an exciting day of talks, workshops, and networking.',
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
      const normalizedEvent = normalizeEventId(action.payload);
      return { ...state, events: [normalizedEvent, ...state.events] };
    }
    case 'EDIT_EVENT':
      return {
        ...state,
        events: state.events.map((ev) =>
          ev.id === action.payload.id ? normalizeEventId(action.payload) : ev
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((ev) => ev.id !== action.payload),
      };
    case 'SET_EVENTS':
      return { ...state, events: normalizeEvents(action.payload) };
    case 'RSVP': {
      const { eventId, userId } = action.payload;
      return {
        ...state,
        events: state.events.map((ev) => {
          if (ev.id !== eventId) return ev;
          const rsvps = ev.rsvps || [];
          if (rsvps.some((id) => id === userId || id?._id === userId)) {
            return ev;
          }
          return {
            ...ev,
            rsvps: [...rsvps, userId],
            attending: (ev.attending || 0) + 1,
          };
        }),
      };
    }
    case 'CANCEL_RSVP': {
      const { eventId, userId } = action.payload;
      return {
        ...state,
        events: state.events.map((ev) => {
          if (ev.id !== eventId) return ev;
          const rsvps = (ev.rsvps || []).filter(
            (id) => id !== userId && id?._id !== userId
          );
          return {
            ...ev,
            rsvps,
            attending: Math.max(0, (ev.attending || 0) - 1),
          };
        }),
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 1) Restore user from localStorage on first load
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN', payload: parsed });
      }
    } catch (e) {
      console.error('Error restoring user from storage:', e);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.get('/event', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = response.data;
      const rawEvents = Array.isArray(data) ? data : data.events || [];

      dispatch({ type: 'SET_EVENTS', payload: rawEvents });
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  }, []);

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Persist events to localStorage
  useEffect(() => {
    try {
      const normalized = normalizeEvents(state.events);
      localStorage.setItem('events', JSON.stringify(normalized));
    } catch (e) {
      console.error('Error saving events:', e);
    }
  }, [state.events]);

  const deleteEvent = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await api.delete(`/event/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (err) {
      console.error('Error deleting event from backend:', err);
    }
    dispatch({ type: 'DELETE_EVENT', payload: id });
  };

  const rsvp = async (eventId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.post(`/event/${eventId}/rsvp`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.status < 200 || response.status >= 300) {
        const error = response.data || {};
        return { success: false, error: error.message || 'Failed to RSVP' };
      }
      dispatch({ type: 'RSVP', payload: { eventId, userId: state.user?.id } });
      return { success: true };
    } catch (err) {
      console.error('Error RSVPing:', err);
      return { success: false, error: 'Network error' };
    }
  };

  const cancelRsvp = async (eventId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await api.delete(`/event/${eventId}/rsvp`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (response.status < 200 || response.status >= 300) {
        const error = response.data || {};
        return { success: false, error: error.message || 'Failed to cancel RSVP' };
      }
      dispatch({
        type: 'CANCEL_RSVP',
        payload: { eventId, userId: state.user?.id },
      });
      return { success: true };
    } catch (err) {
      console.error('Error canceling RSVP:', err);
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    user: state.user,
    events: state.events,

    // When login is called after /login API, also persist user
    login: (user) => {
      dispatch({ type: 'LOGIN', payload: user });
      localStorage.setItem('user', JSON.stringify(user));
    },

    logout: () => {
      dispatch({ type: 'LOGOUT' });
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
    },

    addEvent: (ev) => dispatch({ type: 'ADD_EVENT', payload: ev }),
    editEvent: (ev) => dispatch({ type: 'EDIT_EVENT', payload: ev }),
    deleteEvent,
    rsvp,
    cancelRsvp,
    fetchEvents,
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

