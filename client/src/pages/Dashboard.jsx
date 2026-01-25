import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import EventCard from '../components/EventCard';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import Input from '../components/Input';
import { EventCardSkeleton } from '../components/Skeleton';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../hooks/useEvents';
import { FiSearch } from 'react-icons/fi';
import { LayoutGrid, Calendar } from 'lucide-react';
import CalendarView from '../components/CalendarView';
import { useToast } from '../context/ToastContext';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { isUserRsvped, isEventFull } from '../utils/rsvpHelper';
import { useRef } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [rsvpLoading, setRsvpLoading] = useState({});

  const { user, logout } = useAuth();
  const { events, rsvp, cancelRsvp, fetchEvents, loading: globalLoading, error: eventsError } = useEvents();
  const { addToast } = useToast();

  const searchInputRef = useRef(null);

  useKeyboardShortcuts(() => {
    searchInputRef.current?.focus();
  });

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
    setRsvpLoading(prev => ({ ...prev, [eventId]: true }));
    const result = isJoined ? await cancelRsvp(eventId) : await rsvp(eventId);
    if (result.success) {
      addToast(isJoined ? 'Successfully left event' : 'Spot reserved successfully!', 'success');
    } else {
      addToast(result.error || 'Action failed', 'error');
    }
    setRsvpLoading(prev => ({ ...prev, [eventId]: false }));
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
          <div className="flex flex-col items-start justify-between gap-6 mb-16 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-black transition-colors duration-500 text-neutral-900 dark:text-white">
                Discover Events
              </h1>
              <p className="text-sm transition-colors duration-500 text-neutral-600 dark:text-gray-400">
                Find and join events in your area
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid'
                      ? 'bg-white dark:bg-neutral-700 text-indigo-600 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  title="Grid View"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`p-1.5 rounded-lg transition-all ${viewMode === 'calendar'
                      ? 'bg-white dark:bg-neutral-700 text-indigo-600 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                  title="Calendar View"
                >
                  <Calendar size={18} />
                </button>
              </div>
              <Button
                onClick={() => navigate('/create-event')}
                variant="primary"
                size="md"
                className="px-6 py-2.5 text-base font-bold whitespace-nowrap"
              >
                + Create Event
              </Button>
            </div>
          </div>

          <div className="mb-10">
            <div className="mb-3">
              <Input
                ref={searchInputRef}
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<FiSearch size={20} />}
                showLabel={false}
                className="text-sm h-11"
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
                <option value="health">Health</option>
                <option value="education">Education</option>
                <option value="workshop">Workshop</option>
                <option value="social">Social</option>
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

          {eventsError && (
            <div className="p-4 mb-8 text-sm text-red-700 border border-red-200 rounded-xl bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{eventsError}</span>
                <button 
                  onClick={() => fetchEvents()} 
                  className="ml-auto font-bold underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {globalLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredEventsList.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredEventsList.map((event, index) => {
                  const eventId = event._id || event.id;
                  const currentUserId = user?.id || user?._id;
                  
                  // Use helper function for consistent RSVP checking
                  const isJoined = isUserRsvped(event, currentUserId);
                  const isFull = isEventFull(event);

                  return (
                    <div
                      key={eventId}
                      className="opacity-0 animate-slide-up-fade"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <EventCard
                        event={event}
                        isJoined={isJoined}
                        isFull={isFull}
                        onViewDetails={() => handleViewDetails(eventId)}
                        onRsvp={() => handleToggleRsvp(eventId, isJoined)}
                        loading={rsvpLoading[eventId]}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <CalendarView events={filteredEventsList} />
            )
          ) : (
            <div className="py-24 text-center border glass-surface rounded-3xl border-neutral-100 dark:border-neutral-800 animate-fade-in">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="relative p-6 bg-white border rounded-full dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 shadow-premium">
                  <FiSearch className="w-12 h-12 text-neutral-300 dark:text-neutral-600" />
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-black text-neutral-900 dark:text-white">
                No events found
              </h3>
              <p className="max-w-md mx-auto mb-10 text-neutral-600 dark:text-neutral-400">
                We couldn't find any events matching your current filters. Try adjusting your search term or category.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button onClick={clearFilters} variant="secondary">
                  Clear All Filters
                </Button>
                <Button onClick={() => navigate('/create-event')} variant="primary">
                  Create First Event
                </Button>
              </div>
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

