import React from 'react';
import { AuthProvider } from './AuthContext';
import { EventProvider } from './EventContext';

export function CombinedProvider({ children }) {
  return (
    <AuthProvider>
      <EventProvider>
        {children}
      </EventProvider>
    </AuthProvider>
  );
}
