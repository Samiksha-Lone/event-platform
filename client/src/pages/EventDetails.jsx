import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../utils/api';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppProvider';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rsvpLoading, setRsvpLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);

        const response = await api.get(`/event/${id}`);

        if (response.data?.event) {
          const ev = response.data.event;

          const eventData = {
            ...ev,
            id: ev._id || id,
            title: ev.title,
            description: ev.description,
            date: ev.date ? new Date(ev.date).toLocaleDateString() : 'N/A',
            time: ev.time || '09:00',
            location: ev.location || 'TBA',
            capacity: ev.capacity || 0,
            attending: ev.rsvps?.length || 0,
            organizer: ev.owner?.name || 'Unknown organizer',
            image: ev.image || '',
          };

          setEvent(eventData);
          setError(null);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-indigo-200 rounded-full dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 animate-spin" />
          <p className="text-lg text-neutral-600 dark:text-neutral-300">
            Loading event...
          </p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
            {error || 'Event Not Found'}
          </h1>
          <Button onClick={() => navigate('/dashboard')} variant="primary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleRsvp = async () => {
    try {
      setRsvpLoading(true);
      const res = await api.post(`/event/${event.id}/rsvp`);

      if (res.data?.attendingCount !== undefined) {
        setEvent(prev => ({
          ...prev,
          attending: res.data.attendingCount,
        }));
      } else {
        setEvent(prev => ({ ...prev, attending: prev.attending + 1 }));
      }

      addToast(res.data?.message || 'RSVP successful', 'success');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Please log in to RSVP.'
          : 'Could not complete RSVP. Please try again.');
      addToast(msg, 'error');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setRsvpLoading(true);
      const res = await api.delete(`/event/${event.id}/rsvp`);

      if (res.data?.attendingCount !== undefined) {
        setEvent(prev => ({
          ...prev,
          attending: res.data.attendingCount,
        }));
      } else {
        setEvent(prev => ({
          ...prev,
          attending: Math.max(0, prev.attending - 1),
        }));
      }

      addToast(res.data?.message || 'RSVP cancelled', 'info');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 401
          ? 'Please log in first.'
          : 'Could not cancel RSVP. Please try again.');
      addToast(msg, 'error');
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleCopyLink = () => {
    const eventLink = `${window.location.origin}/event/${event.id}`;
    navigator.clipboard.writeText(eventLink);
    addToast('Event link copied to clipboard!', 'info');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title} on ${event.date}`,
        url: window.location.href,
      });
    } else {
      addToast('Share functionality not supported on this device. Use "Copy Link" instead.', 'error');
    }
  };

  const handleNavigate = (path) => {
    navigate(`/${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  const capacity = event.capacity || 0;
  const attending = event.attending || 0;
  const fillPercent =
    capacity > 0 ? Math.min(100, (attending / capacity) * 100) : 0;

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
      <Navbar
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        showThemeToggle={false}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl py-16 mx-auto">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mb-8 text-base text-indigo-600 transition-opacity dark:text-indigo-400 hover:opacity-80"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Events
          </button>

          <div className="w-full mb-8 overflow-hidden rounded-xl max-h-80">
            {event.image ? (
              <img
                src={event.image}
                alt={event.title}
                className="object-cover w-full h-auto max-h-80"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-80 sm:h-96 bg-gradient-to-br from-indigo-300 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800">
                <svg
                  className="w-24 h-24 text-indigo-500 dark:text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                </svg>
              </div>
            )}
          </div>
          
          <div className="mb-10">
            <h1 className="mb-2 text-4xl font-bold text-neutral-900 dark:text-neutral-50">
              {event.title}
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400">
              Organized by {event.organizer}
            </p>
          </div>

          <div className="grid items-stretch grid-cols-1 gap-10 mb-12 lg:grid-cols-3">
            <div className="flex flex-col justify-between space-y-8 lg:col-span-2">
              <div className="p-6 bg-white border rounded-xl border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="mb-3 text-base font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  Date & Time
                </h3>
                <p className="mb-1 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {event.date}
                </p>
                <p className="text-base text-neutral-600 dark:text-neutral-400">
                  {event.time}
                </p>
              </div>

              <div className="p-6 bg-white border rounded-xl border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="mb-3 text-base font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  Location
                </h3>
                <div className="flex items-start gap-4">
                  <svg
                    className="flex-shrink-0 w-6 h-6 mt-1 text-indigo-600 dark:text-indigo-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-base text-neutral-900 dark:text-neutral-50">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white border rounded-xl border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                <h3 className="mb-3 text-base font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  Attendees
                </h3>
                <p className="mb-3 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  {attending} / {capacity} attending
                </p>
                <div className="w-full h-3 rounded-full bg-neutral-200 dark:bg-neutral-800">
                  <div
                    className="h-3 bg-indigo-600 rounded-full dark:bg-indigo-500"
                    style={{ width: `${fillPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col h-full space-y-6">
              <div className="flex-1 p-6 border border-indigo-200 rounded-xl bg-indigo-50 dark:border-indigo-900 dark:bg-neutral-900">
                <h3 className="mb-3 text-xl font-bold text-neutral-900 dark:text-neutral-50">
                  Join This Event
                </h3>
                <p className="mb-4 text-base text-neutral-600 dark:text-neutral-400">
                  {Math.max(0, capacity - attending)} spots remaining
                </p>
                <div className="flex flex-col gap-2.5">
                  <Button
                    onClick={handleRsvp}
                    variant="primary"
                    size="md"
                    className="w-full"
                    disabled={rsvpLoading}
                  >
                    {rsvpLoading ? (
                      <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      'RSVP'
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="secondary"
                    size="md"
                    className="w-full"
                    disabled={rsvpLoading}
                  >
                    {rsvpLoading ? (
                      <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      'Cancel RSVP'
                    )}
                  </Button>
                </div>
              </div>

              <div className="p-6 bg-white border rounded-xl border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
                <h4 className="mb-3 text-base font-bold text-neutral-900 dark:text-neutral-50">
                  Share Event
                </h4>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="w-full p-2.5 text-sm font-semibold transition-colors rounded-lg bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full p-2.5 text-sm font-semibold transition-colors rounded-lg bg-neutral-200 text-neutral-900 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-50 dark:hover:bg-neutral-700"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-white border rounded-xl border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900">
            <h2 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
              About This Event
            </h2>
            <p className="text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
