import { useState } from 'react';
import EventCard from '../components/EventCard';

export default function UserDashboard({ onNavigate, user }) {
  const [activeTab, setActiveTab] = useState('created');

  // Mock data for created events
  const createdEvents = [
    {
      id: 1,
      title: 'Local Coffee Meetup',
      date: 'Jan 18, 2025',
      time: '03:00 PM',
      location: 'Coffee Shop Downtown',
      capacity: 30,
      attending: 18,
    },
    {
      id: 2,
      title: 'Book Club Discussion',
      date: 'Jan 22, 2025',
      time: '07:00 PM',
      location: 'Library Community Center',
      capacity: 25,
      attending: 12,
    },
  ];

  // Mock data for attending events
  const attendingEvents = [
    {
      id: 3,
      title: 'Tech Conference 2025',
      date: 'Jan 15, 2025',
      time: '09:00 AM',
      location: 'San Francisco, CA',
      capacity: 500,
      attending: 342,
    },
    {
      id: 4,
      title: 'React Workshop',
      date: 'Jan 20, 2025',
      time: '02:00 PM',
      location: 'New York, NY',
      capacity: 50,
      attending: 48,
    },
    {
      id: 5,
      title: 'Web Design Meetup',
      date: 'Jan 25, 2025',
      time: '06:00 PM',
      location: 'Austin, TX',
      capacity: 100,
      attending: 67,
    },
  ];

  const handleViewDetails = (eventId) => {
    onNavigate('event-details');
  };

  const handleRsvp = (eventId) => {
    alert('Action completed! (UI only)');
  };

  const handleEditEvent = (eventId) => {
    // Find the event object and navigate to edit page with the event as payload
    const ev = createdEvents.find((e) => e.id === eventId);
    if (ev) {
      onNavigate('edit-event', { event: ev });
    } else {
      onNavigate('edit-event');
    }
  };

  const handleDeleteEvent = (eventId) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (confirmed) {
      alert(`Event ${eventId} deleted! (UI only)`);
      // In a real app, would remove from state/backend
    }
  };

  return (
    <div className="w-full px-6 py-16 sm:px-8 lg:px-10">
      {/* Header */}
      <div className="mb-12">
        <h1 className="mb-3 text-4xl font-bold sm:text-5xl text-neutral-900 dark:text-neutral-50">
          My Dashboard
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Welcome, {user?.name}! Manage your events and registrations.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2">
        <div className="p-8 bg-white border dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <h3 className="mb-3 text-base font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            Events Created
          </h3>
          <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-500">
            {createdEvents.length}
          </p>
        </div>
        <div className="p-8 bg-white border dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <h3 className="mb-3 text-base font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
            Events Attending
          </h3>
          <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-500">
            {attendingEvents.length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-10 overflow-x-auto border-b-2 border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('created')}
          className={`px-6 py-4 font-bold text-lg border-b-4 transition-all -mb-0.5 whitespace-nowrap ${
            activeTab === 'created'
              ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-500'
              : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50'
          }`}
        >
          My Events ({createdEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('attending')}
          className={`px-6 py-4 font-bold text-lg border-b-4 transition-all -mb-0.5 whitespace-nowrap ${
            activeTab === 'attending'
              ? 'border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-500'
              : 'border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50'
          }`}
        >
          Attending ({attendingEvents.length})
        </button>
      </div>

      {/* Events Grid */}
      <div>
        {activeTab === 'created' ? (
          <div>
            <div className="flex flex-col items-start justify-between gap-4 mb-10 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                Events You've Created
              </h2>
              <button
                onClick={() => onNavigate('create-event')}
                className="px-8 py-3 text-lg font-bold text-white transition-colors bg-indigo-600 hover:bg-indigo-700 rounded-xl"
              >
                + New Event
              </button>
            </div>

            {createdEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {createdEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    isOwnEvent={true}
                    onEdit={() => handleEditEvent(event.id)}
                    onDelete={() => handleDeleteEvent(event.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  You haven't created any events yet.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="mb-10 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              Events You're Attending
            </h2>
            {attendingEvents.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {attendingEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onViewDetails={() => handleViewDetails(event.id)}
                    onRsvp={() => handleRsvp(event.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-lg text-neutral-600 dark:text-neutral-400">
                  You're not attending any events yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
