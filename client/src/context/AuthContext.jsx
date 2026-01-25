import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

const initialState = {
  user: null,
  loading: true,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { ...state, loading: false, user: action.payload, error: null };
    case 'AUTH_FAILURE':
      return { ...state, loading: false, user: null, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, loading: false, error: null };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.post('/auth/login', credentials);
      const { user, token } = response.data;
      
      const userToSave = {
        id: user.id || user._id,
        name: user.name || user.email?.split('@')[0],
        email: user.email,
        ...user
      };

      sessionStorage.setItem('user', JSON.stringify(userToSave));
      sessionStorage.setItem('authToken', token);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: userToSave });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      return { success: false, error: message };
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.post('/auth/register', userData);
      const { newUser, token } = response.data;
      const user = newUser || response.data.user || response.data;
      
      const userToSave = {
        id: user.id || user._id,
        name: user.name || userData.name,
        email: user.email || userData.email,
        ...user
      };

      sessionStorage.setItem('user', JSON.stringify(userToSave));
      sessionStorage.setItem('authToken', token);

      dispatch({ type: 'AUTH_SUCCESS', payload: userToSave });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      return { success: false, error: message };
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('authToken');
    dispatch({ type: 'LOGOUT' });
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        dispatch({ type: 'AUTH_SUCCESS', payload: JSON.parse(storedUser) });
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        sessionStorage.removeItem('user');
        dispatch({ type: 'AUTH_FAILURE', payload: null });
      }
    } else {
      dispatch({ type: 'AUTH_FAILURE', payload: null });
    }
  }, []);

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError: () => dispatch({ type: 'CLEAR_ERROR' }),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
