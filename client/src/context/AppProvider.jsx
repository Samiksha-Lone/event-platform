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

// const initialState = {
//   user: null,
//   events: typeof window !== 'undefined' && localStorage.getItem('events')
//     ? normalizeEvents(JSON.parse(localStorage.getItem('events')))
//     : [
//       {
//         id: 1,
//         title: 'Tech Conference 2025',
//         description: 'Join us for an exciting day of talks, workshops, and networking.',
//         date: '2025-01-15',
//         time: '09:00',
//         location: 'San Francisco Convention Center',
//         capacity: 500,
//         attending: 342,
//         organizer: 'Tech Events Inc.',
//       },
//     ],
// };

const initialState = {
  user: null,
  events:
    typeof window !== 'undefined' && localStorage.getItem('events')
      ? normalizeEvents(JSON.parse(localStorage.getItem('events')))
      : [
          {
            id: 'seed-1',                // string, not number
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
      const event = action.payload;
      const normalizedEvent = normalizeEventId(event);
      return { ...state, events: [normalizedEvent, ...state.events] };
    }
    case 'EDIT_EVENT':
      return { ...state, events: state.events.map(ev => (ev.id === action.payload.id ? action.payload : ev)) };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(ev => ev.id !== action.payload) };
    case 'RSVP': {
      const { eventId, userId } = action.payload;
      return {
        ...state,
        events: state.events.map(ev => {
          if (ev.id === eventId) {
            const rsvps = ev.rsvps || [];
            // Check if user already RSVP'd
            if (rsvps.some(id => id === userId || id?._id === userId)) {
              return ev; // User already joined
            }
            return {
              ...ev,
              rsvps: [...rsvps, userId],
              attending: (ev.attending || 0) + 1,
            };
          }
          return ev;
        }),
      };
    }
    case 'CANCEL_RSVP': {
      const { eventId, userId } = action.payload;
      return {
        ...state,
        events: state.events.map(ev => {
          if (ev.id === eventId) {
            const rsvps = (ev.rsvps || []).filter(id => id !== userId && id?._id !== userId);
            return {
              ...ev,
              rsvps,
              attending: Math.max(0, (ev.attending || 0) - 1),
            };
          }
          return ev;
        }),
      };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Fetch events from database on mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/event'); // Adjust URL to your backend
        if (response.ok) {
          const data = await response.json();
          const normalizedData = normalizeEvents(data);
          normalizedData.forEach(event => {
            dispatch({ type: 'ADD_EVENT', payload: event });
          });
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        // Fall back to localStorage if fetch fails
        try {
          const stored = localStorage.getItem('events');
          if (stored) {
            const parsedEvents = JSON.parse(stored);
            parsedEvents.forEach(event => {
              dispatch({ type: 'ADD_EVENT', payload: event });
            });
          }
        } catch (e) {
          console.error('Error loading from localStorage:', e);
        }
      }
    };

    // Only fetch if we don't have events yet
    if (state.events.length <= 1) {
      fetchEvents();
    }
  }, []);

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
    deleteEvent: id => {
      // Delete from backend
      fetch(`http://localhost:3000/event/${id}`, { method: 'DELETE' })
        .catch(error => console.error('Error deleting event from backend:', error));
      // Delete from local state
      dispatch({ type: 'DELETE_EVENT', payload: id });
    },
    rsvp: async (eventId) => {
      // Call backend to RSVP
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3000/event/${eventId}/rsvp`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: 'RSVP', payload: { eventId, userId: state.user?.id } });
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, error: error.message || 'Failed to RSVP' };
        }
      } catch (error) {
        console.error('Error RSVPing:', error);
        return { success: false, error: 'Network error' };
      }
    },
    cancelRsvp: async (eventId) => {
      // Call backend to cancel RSVP
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`http://localhost:3000/event/${eventId}/rsvp`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          dispatch({ type: 'CANCEL_RSVP', payload: { eventId, userId: state.user?.id } });
          return { success: true };
        } else {
          const error = await response.json();
          return { success: false, error: error.message || 'Failed to cancel RSVP' };
        }
      } catch (error) {
        console.error('Error canceling RSVP:', error);
        return { success: false, error: 'Network error' };
      }
    }
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
