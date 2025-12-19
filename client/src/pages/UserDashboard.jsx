import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppProvider';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user, events, logout, deleteEvent, cancelRsvp } = useAppContext();
  const [activeTab, setActiveTab] = useState('created');

  // Filter events created by user and events attending
  const createdEvents = events.filter(e => {
    // Check if user created this event by comparing organizer name or owner id
    return e.organizer === user?.name ||
      (e.owner && user && (e.owner._id === user.id || e.owner === user.id));
  }) || [];

  const attendingEvents = events.filter(e => {
    // Events user is attending (where user is not the organizer)
    return e.organizer !== user?.name &&
      !(e.owner && user && (e.owner._id === user.id || e.owner === user.id));
  }) || [];

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleRsvp = (eventId) => {
    cancelRsvp(eventId);
  };

  const handleNavigate = (path) => {
    navigate(`/${path}`);
  };

  const handleEditEvent = (eventId) => {
    navigate(`/edit-event/${eventId}`);
  };

  const handleDeleteEvent = (eventId) => {
    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (confirmed) {
      deleteEvent(eventId);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/user/login');
  };

  return (
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-neutral-950">
      <Navbar
        user={user}
        onNavigate={handleNavigate}
        showThemeToggle={true}
        onLogout={handleLogout}
      />

      <div className="py-16 container-padding">
        <div className="site-container">
          <div className="mb-12">
            <h1 className="mb-3 text-4xl font-extrabold transition-colors duration-500 sm:text-4xl text-neutral-900 dark:text-neutral-50">My Dashboard</h1>
            <p className="text-xl duration-500 transmdition-colors text-neutral-600 dark:text-neutral-400">Welcome, {user?.name}! Manage your events and registrations.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 gap-6 mb-12 sm:grid-cols-2">
            <div className="p-5 transition-all transition-colors duration-200 duration-500 bg-white border text-neutral-900 border-neutral-200 rounded-2xl hover:shadow-lg dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-800">
              <h3 className="text-xl transition-colors duration-500 text-neutral-600 dark:text-neutral-400">Events Created</h3>
              <p className="mt-2 text-2xl font-bold">{createdEvents.length}</p>
            </div>
            <div className="p-5 transition-all transition-colors duration-200 duration-500 bg-white border text-neutral-900 border-neutral-200 rounded-2xl hover:shadow-lg dark:bg-neutral-900 dark:text-neutral-50 dark:border-neutral-800">
              <h3 className="text-xl transition-colors duration-500 text-neutral-600 dark:text-neutral-400">Events Attending</h3>
              <p className="mt-2 text-2xl font-bold">{attendingEvents.length}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-3 mb-6 transition-colors duration-500 border-b border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setActiveTab('created')}
              className={`px-4 py-2 text-xl border-b-2 border-transparent rounded-t-lg transition-all duration-300 ${activeTab === 'created' ? 'text-indigo-600 dark:text-indigo-500 border-indigo-600 dark:border-indigo-500' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'}`}
            >
              My Events ({createdEvents.length})
            </button>
            <button
              onClick={() => setActiveTab('attending')}
              className={`px-4 py-2 text-xl border-b-2 border-transparent rounded-t-lg transition-all duration-300 ${activeTab === 'attending' ? 'text-indigo-600 dark:text-indigo-500 border-indigo-600 dark:border-indigo-500' : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'}`}
            >
              Attending ({attendingEvents.length})
            </button>
          </div>

          {/* Events Grid */}
          <div>
            {activeTab === 'created' ? (
              <div>
                <div className="flex flex-col items-start justify-between gap-4 mb-10 sm:flex-row sm:items-center">
                  <h2 className="text-2xl font-bold transition-colors duration-500 text-neutral-900 dark:text-neutral-50">Events You've Created</h2>
                  <button onClick={() => navigate('/create-event')} className="px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-700">+ New Event</button>
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
                  <div className="italic transition-colors duration-500 text-neutral-600 dark:text-neutral-400">You haven't created any events yet.</div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="mb-10 text-xl font-bold transition-colors duration-500 text-neutral-900 dark:text-neutral-50">Events You're Attending</h2>
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
                  <div className="italic transition-colors duration-500 text-neutral-600 dark:text-neutral-400">You're not attending any events yet.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
