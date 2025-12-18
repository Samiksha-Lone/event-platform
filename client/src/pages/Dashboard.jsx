import { useState } from 'react';
import EventCard from '../components/EventCard';
import Button from '../components/Button';

export default function Dashboard({ onNavigate, user }) {
  const [events] = useState([
    {
      id: 1,
      title: 'Tech Conference 2025',
      date: 'Jan 15, 2025',
      time: '09:00 AM',
      location: 'San Francisco, CA',
      capacity: 500,
      attending: 342,
    },
    {
      id: 2,
      title: 'React Workshop',
      date: 'Jan 20, 2025',
      time: '02:00 PM',
      location: 'New York, NY',
      capacity: 50,
      attending: 48,
    },
    {
      id: 3,
      title: 'Web Design Meetup',
      date: 'Jan 25, 2025',
      time: '06:00 PM',
      location: 'Austin, TX',
      capacity: 100,
      attending: 67,
    },
    {
      id: 4,
      title: 'Startup Networking Event',
      date: 'Feb 01, 2025',
      time: '05:30 PM',
      location: 'Seattle, WA',
      capacity: 200,
      attending: 124,
    },
    {
      id: 5,
      title: 'AI & Machine Learning Summit',
      date: 'Feb 10, 2025',
      time: '10:00 AM',
      location: 'Boston, MA',
      capacity: 300,
      attending: 189,
    },
    {
      id: 6,
      title: 'Digital Marketing Workshop',
      date: 'Feb 15, 2025',
      time: '03:00 PM',
      location: 'Los Angeles, CA',
      capacity: 75,
      attending: 52,
    },
  ]);

  const handleViewDetails = (eventId) => {
    // In a real app, would pass event data
    onNavigate('event-details');
  };

  const handleRsvp = (eventId) => {
    // UI feedback (no actual state change for demo)
    alert('RSVP submitted! (UI only)');
  };

  return (
    <div className="w-full px-6 py-16 sm:px-8 lg:px-10">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 mb-16 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-3 text-4xl font-bold sm:text-5xl text-neutral-900 dark:text-neutral-50">
            Discover Events
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Find and join events in your area
          </p>
        </div>
        <Button onClick={() => onNavigate('create-event')} variant="primary" size="lg" className="px-8">
          + Create Event
        </Button>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onViewDetails={() => handleViewDetails(event.id)}
            onRsvp={() => handleRsvp(event.id)}
          />
        ))}
      </div>
    </div>
  );
}
