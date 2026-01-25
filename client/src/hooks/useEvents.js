import { useContext } from 'react';
import { EventContext } from '../context/EventContextDefine';

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) throw new Error('useEvents must be used within an EventProvider');
  return context;
}
