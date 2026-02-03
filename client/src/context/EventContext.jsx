import React, { useReducer, useEffect, useCallback } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';
import { EventContext } from './EventContextDefine';

const normalizeEventId = (event) => {
  let id = event.id;
  if (!id && event._id) {
    id = typeof event._id === 'string' ? event._id : event._id.toString();
  }
  if (!id) id = Math.random().toString(36).substr(2, 9);
  return { ...event, id };
};

const normalizeEvents = (events = []) => events.map(normalizeEventId);

const initialState = {
  events: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalEvents: 0,
    hasMore: false
  }
};


const getMemberId = (m) => {
  if (!m) return null;
  if (typeof m === 'string') return m;
  return m._id || m.id || null;
};
 
function eventReducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        events: normalizeEvents(action.payload.events), 
        pagination: action.payload.pagination || state.pagination,
        error: null 
      };
    case 'FETCH_MORE_SUCCESS':
      return {
        ...state,
        loading: false,
        events: [...state.events, ...normalizeEvents(action.payload.events)],
        pagination: action.payload.pagination || state.pagination,
        error: null
      };
    case 'FETCH_FAILURE':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_EVENT':
      return { ...state, events: [normalizeEventId(action.payload), ...state.events] };
    case 'EDIT_EVENT':
      return {
        ...state,
        events: state.events.map((ev) => {
          const normalizedPayload = normalizeEventId(action.payload);
          const isMatch = ev.id === normalizedPayload.id;
          if (!isMatch) return ev;
          
          return {
            ...normalizedPayload,
            rsvps: normalizedPayload.rsvps || [],
          };
        }),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter((ev) => ev.id !== action.payload),
      };
    case 'RSVP': {
      const { eventId, userId } = action.payload;
      return {
        ...state,
        events: state.events.map((ev) => {
          const eventMatch = String(ev.id) === String(eventId) || String(ev._id) === String(eventId);
          if (!eventMatch) return ev;
          
          const rsvps = ev.rsvps || [];
          if (rsvps.some((m) => {
            const mid = getMemberId(m);
            return mid && String(mid) === String(userId);
          })) return ev;
          
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
          const eventMatch = String(ev.id) === String(eventId) || String(ev._id) === String(eventId);
          if (!eventMatch) return ev;
          
          const rsvps = (ev.rsvps || []).filter((m) => {
            const mid = getMemberId(m);
            return mid && String(mid) !== String(userId);
          });
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

export function EventProvider({ children }) {
  const [state, dispatch] = useReducer(eventReducer, initialState);
  const { user } = useAuth();

  const fetchEvents = useCallback(async (page = 1, limit = 10, category = 'all', append = false) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const token = sessionStorage.getItem('authToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (category && category !== 'all') {
        params.append('category', category);
      }
      
      const response = await api.get(`/event?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = response.data;
      
      dispatch({ 
        type: append ? 'FETCH_MORE_SUCCESS' : 'FETCH_SUCCESS', 
        payload: {
          events: data.events || [],
          pagination: data.pagination || {}
        }
      });
    } catch (err) {
      console.error('[EventContext] fetchEvents error:', err);
      dispatch({ type: 'FETCH_FAILURE', payload: err.message || 'Failed to fetch events' });
    }
  }, []);

  const addEvent = (ev) => dispatch({ type: 'ADD_EVENT', payload: ev });
  const editEvent = (ev) => dispatch({ type: 'EDIT_EVENT', payload: ev });

  const deleteEvent = async (id) => {
    try {
      const token = sessionStorage.getItem('authToken');
      await api.delete(`/event/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      dispatch({ type: 'DELETE_EVENT', payload: id });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to delete event' };
    }
  };

  const rsvp = async (eventId) => {
    if (!user) return { success: false, error: 'Please login to RSVP' };
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await api.post(`/event/${eventId}/rsvp`, {}, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (response.data?.event) {
        const normalizedEvent = normalizeEventId(response.data.event);
        dispatch({ type: 'EDIT_EVENT', payload: normalizedEvent });
      } else {
        dispatch({ type: 'RSVP', payload: { eventId, userId: user.id || user._id } });
      }
      
      setTimeout(() => fetchEvents(), 100);
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || 'Failed to RSVP' };
    }
  };

  const cancelRsvp = async (eventId) => {
    if (!user) return { success: false, error: 'Please login' };
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await api.delete(`/event/${eventId}/rsvp`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      
      if (response.data?.event) {
        const normalizedEvent = normalizeEventId(response.data.event);
        dispatch({ type: 'EDIT_EVENT', payload: normalizedEvent });
      } else {
        dispatch({ type: 'CANCEL_RSVP', payload: { eventId, userId: user.id || user._id } });
      }
      
      setTimeout(() => fetchEvents(), 100);
      
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || 'Failed to cancel RSVP' };
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const value = {
    ...state,
    fetchEvents,
    addEvent,
    editEvent,
    deleteEvent,
    rsvp,
    cancelRsvp,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}
