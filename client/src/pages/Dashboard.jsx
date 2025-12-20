import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import { useAppContext } from '../context/AppProvider';

export default function Dashboard() {
  const navigate = useNavigate();
  const { events, user, rsvp, logout } = useAppContext();

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleRsvp = async (eventId) => {
    const result = await rsvp(eventId);
    if (!result.success) {
      alert(`RSVP Failed: ${result.error}`);
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
    <div className="min-h-screen transition-colors duration-500 bg-white dark:bg-neutral-950">
      <Navbar
        user={user}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        showThemeToggle={false}
      />

      <div className="container-padding">
        <div className="py-16 site-container">
          {/* Header Section */}
          <div className="flex flex-col items-start justify-between gap-6 mb-16 sm:flex-row sm:items-center">
            <div className="flex-1">
              <h1 className="mb-3 text-4xl font-black transition-colors duration-500 text-neutral-900 dark:text-white">Discover Events</h1>
              <p className="text-base transition-colors duration-500 text-neutral-600 dark:text-gray-400">Find and join events in your area</p>
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

          {/* Events Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events
              .filter(event => event && (event._id || event.id))
              .map((event) => {
                const eventId = event._id || event.id;

                const rsvps = event.rsvps || [];
                const isJoined = rsvps.some(
                  id => id === user?.id || id?._id === user?.id
                );
                const isFull = rsvps.length >= event.capacity;
                const isOwnEvent =
                  event.owner === user?.id || event.owner?._id === user?.id;

                return (
                  <EventCard
                    key={eventId}
                    event={event}
                    isOwnEvent={isOwnEvent}
                    isJoined={isJoined}
                    isFull={isFull}
                    onViewDetails={() => handleViewDetails(eventId)}
                    onRsvp={() => handleRsvp(eventId)}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
