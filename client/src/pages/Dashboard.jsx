import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import EventCard from '../components/EventCard';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { useAppContext } from '../context/AppProvider';
import { FiSearch } from 'react-icons/fi';

export default function Dashboard() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [rsvpError, setRsvpError] = useState('');

  const { events, user, rsvp, cancelRsvp, logout, fetchEvents } = useAppContext();

  const filteredEvents = useCallback(() => {
    return events.filter((event) => {
      if (!event) return false;
      const hasId = event._id || event.id;
      if (!hasId) return false;

      const matchesSearch =
        !searchTerm ||
        event.title?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        filterCategory === 'all' || event.category === filterCategory;

      const matchesDate =
        !filterDate || new Date(event.date) >= new Date(filterDate);

      return matchesSearch && matchesCategory && matchesDate;
    });
  }, [events, searchTerm, filterCategory, filterDate]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleToggleRsvp = async (eventId, isJoined) => {
    setRsvpError('');
    const result = isJoined ? await cancelRsvp(eventId) : await rsvp(eventId);
    if (!result.success) {
      setRsvpError(`${isJoined ? 'Leave' : 'RSVP'} failed: ${result.error}`);
    }
  };

  const handleNavigate = (path) => {
    navigate(`/${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterDate('');
  };

  const filteredEventsList = filteredEvents();
  const totalEvents = events.filter((e) => e && e._id).length;

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-neutral-950">
      <Navbar
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        showThemeToggle={false}
      />

      <div className="container-padding">
        <div className="py-16 site-container">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-6 mb-16 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h1 className="mb-3 text-4xl font-black transition-colors duration-500 text-neutral-900 dark:text-white">
                Discover Events
              </h1>
              <p className="text-base transition-colors duration-500 text-neutral-600 dark:text-gray-400">
                Find and join events in your area
              </p>
            </div>
            <Button
              onClick={() => navigate('/create-event')}
              variant="primary"
              size="lg"
              className="px-8 py-4 text-lg font-bold whitespace-nowrap"
            >
              + Create Event
            </Button>
          </div>

          {/* Search + Filters */}
          <div className="mb-10">
            <div className="mb-3">
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FiSearch size={22} />}
                showLabel={false}
                className="text-base h-14"
              />
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Showing {filteredEventsList.length} of {totalEvents} events
              </p>
            </div>

            <div
              className="flex flex-col gap-3 p-4 border md:flex-row md:items-center bg-neutral-50/80 dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800 rounded-xl"
            >
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="flex-[1.4] h-11 px-3 text-sm rounded-lg bg-white dark:bg-neutral-800
                           border border-neutral-300 dark:border-neutral-700
                           text-neutral-900 dark:text-neutral-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All categories</option>
                <option value="tech">Tech</option>
                <option value="music">Music</option>
                <option value="sports">Sports</option>
                <option value="food">Food</option>
                <option value="other">Other</option>
              </select>

              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="flex-[1.1] h-11 px-4 text-sm rounded-lg bg-white dark:bg-neutral-800
                           border border-neutral-300 dark:border-neutral-700
                           text-neutral-900 dark:text-neutral-100
                           focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <button
                type="button"
                onClick={clearFilters}
                className="h-11 px-6 text-[0.9rem] font-semibold text-indigo-700
                           dark:text-indigo-400 hover:underline whitespace-nowrap"
              >
                Clear filters
              </button>
            </div>
          </div>

          {/* Events Grid */}
          {filteredEventsList.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredEventsList.map((event) => {
                const eventId = event._id || event.id;
                const rsvps = event.rsvps || [];
                const isJoined = rsvps.some(
                  (id) => id === user?.id || id?._id === user?.id
                );
                const isFull = rsvps.length >= event.capacity;
                
                return (
                  <EventCard
                    key={eventId}
                    event={event}
                    isJoined={isJoined}
                    isFull={isFull}
                    onViewDetails={() => handleViewDetails(eventId)}
                    onRsvp={() => handleToggleRsvp(eventId, isJoined)} 
                  />
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center">
              <svg
                className="w-24 h-24 mx-auto mb-6 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-6l-2 2m0 0l-2-2m2 2v7"
                />
              </svg>
              <h3 className="mb-2 text-2xl font-bold text-neutral-900 dark:text-white">
                No events found
              </h3>
              <p className="mb-6 text-neutral-600 dark:text-neutral-400">
                Try adjusting your search or filter criteria
              </p>
              <Button onClick={clearFilters} variant="primary">
                Clear All Filters
              </Button>
            </div>
          )}

          <p className="mt-8 text-sm font-medium text-center text-neutral-600 dark:text-neutral-400">
            Showing {filteredEventsList.length} of {totalEvents} events
          </p>
        </div>
      </div>
    </div>
  );
}

