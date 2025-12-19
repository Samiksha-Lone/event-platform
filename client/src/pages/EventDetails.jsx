import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppProvider';

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAppContext();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/event/${id}`, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.data.event) {
          const eventData = {
            ...response.data.event,
            id: response.data.event._id || id,
            title: response.data.event.title,
            description: response.data.event.description,
            date: new Date(response.data.event.date).toLocaleDateString(),
            time: response.data.event.time || '09:00',
            location: response.data.event.location,
            capacity: response.data.event.capacity,
            attending: response.data.event.rsvps?.length || 0,
            organizer: response.data.event.owner?.name || 'Unknown Organizer',
            image: response.data.event.image
          };
          setEvent(eventData);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError(err.response?.data?.message || 'Failed to fetch event');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center page-wrapper">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 border-4 border-indigo-200 rounded-full dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
          <p className="text-lg neutral-muted">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center page-wrapper">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold event-title">{error || 'Event Not Found'}</h1>
          <Button onClick={() => navigate('/dashboard')} variant="primary">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const handleRsvp = async () => {
    try {
      // Handle RSVP logic here
      alert('RSVP functionality to be implemented');
    } catch (err) {
      console.error('RSVP error:', err);
    }
  };

  const handleCancel = async () => {
    try {
      // Handle Cancel RSVP logic here
      alert('Cancel RSVP functionality to be implemented');
    } catch (err) {
      console.error('Cancel RSVP error:', err);
    }
  };

  const handleCopyLink = () => {
    const eventLink = `${window.location.origin}/event/${event.id}`;
    navigator.clipboard.writeText(eventLink);
    alert('Event link copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title} on ${event.date}`,
        url: window.location.href,
      });
    } else {
      alert('Share functionality not supported on this device. Use "Copy Link" instead.');
    }
  };

  const handleNavigate = (path) => {
    navigate(`/${path}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <div className="page-wrapper">
      <Navbar user={user} 
      onNavigate={handleNavigate} 
      onLogout={handleLogout} 
      showThemeToggle={false} />
      <div className="container-padding">
        <div className="site-container py-16">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 mb-10 text-lg text-indigo-600 transition-opacity dark:text-indigo-500 hover:opacity-80"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Events
        </button>

        {/* Event Image Placeholder */}
        <div className="flex items-center justify-center w-full mb-12 overflow-hidden h-96 sm:h-125 bg-gradient-to-br from-indigo-300 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-2xl relative">
          {event.image ? (
            <img 
              src={event.image} 
              alt={event.title} 
              className="absolute inset-0 w-full h-full object-cover" 
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : null}
          <svg className="w-32 h-32 text-indigo-500 dark:text-indigo-400 relative z-10" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        </div>

        {/* Event Header */}
        <div className="mb-12">
          <h1 className="mb-3 text-5xl font-bold text-neutral-900 dark:text-neutral-50">
            {event.title}
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Organized by {event.organizer}
          </p>
        </div>

        {/* Event Details Grid */}
        <div className="grid grid-cols-1 gap-10 mb-12 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="space-y-8 lg:col-span-2">
            {/* Date & Time */}
            <div className="p-6 border bg-neutral-50 dark:bg-neutral-900 rounded-xl border-neutral-200 dark:border-neutral-800">
              <h3 className="mb-3 text-base font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                Date & Time
              </h3>
              <p className="mb-2 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                {event.date}
              </p>
              <p className="text-lg text-neutral-600 dark:text-neutral-400">{event.time}</p>
            </div>

            {/* Location */}
            <div className="p-6 border bg-neutral-50 dark:bg-neutral-900 rounded-xl border-neutral-200 dark:border-neutral-800">
              <h3 className="mb-3 text-base font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                Location
              </h3>
              <div className="flex items-start gap-4">
                <svg className="flex-shrink-0 w-6 h-6 mt-1 text-indigo-600 dark:text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="text-lg text-neutral-900 dark:text-neutral-50">{event.location}</p>
              </div>
            </div>

            {/* Capacity */}
            <div className="p-6 border bg-neutral-50 dark:bg-neutral-900 rounded-xl border-neutral-200 dark:border-neutral-800">
              <h3 className="mb-3 text-base font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                Attendees
              </h3>
              <p className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                {event.attending} / {event.capacity} attending
              </p>
              <div className="w-full h-3 rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div
                  className="h-3 bg-indigo-600 rounded-full dark:bg-indigo-500"
                  style={{ width: `${(event.attending / event.capacity) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Action Section */}
          <div>
            <div className="space-y-6">
              <div className="p-8 border border-indigo-200 bg-indigo-50 dark:bg-neutral-900 dark:border-indigo-900 rounded-xl">
                <h3 className="mb-4 text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  Join This Event
                </h3>
                <p className="mb-6 text-lg text-neutral-600 dark:text-neutral-400">
                  {event.capacity - event.attending} spots remaining
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleRsvp}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    RSVP
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="secondary"
                    size="lg"
                    className="w-full"
                  >
                    Cancel RSVP
                  </Button>
                </div>
              </div>

              {/* Share Section */}
              <div className="p-6 border bg-neutral-50 dark:bg-neutral-900 rounded-xl border-neutral-200 dark:border-neutral-800">
                <h4 className="mb-4 text-lg font-bold text-neutral-900 dark:text-neutral-50">
                  Share Event
                </h4>
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleCopyLink}
                    className="w-full p-3 font-semibold transition-colors rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full p-3 font-semibold transition-colors rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="p-10 bg-white border dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <h2 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-50">
            About This Event
          </h2>
          <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            {event.description}
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
