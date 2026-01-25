import React from 'react';
import Button from './Button';

export default function EventCard({
  event = {},
  onViewDetails,
  onRsvp,
  isOwnEvent = false,
  onEdit,
  onDelete,
  isJoined = false,
  isFull = false,
  loading = false,
}) {
  const id = event._id || event.id;
  const title = event.title || event.name || 'Untitled Event';
  const date = event.date || event.datetime || '';
  const location = event.location || '';
  const capacity =
    event.capacity || event.capacity === 0 ? event.capacity : '-';
  const attending = event.attending ?? (event.rsvps ? event.rsvps.length : 0);

  return (
    <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_-12px_rgba(79,70,229,0.15)] shadow-sm">
      <div className="relative h-48 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.style.opacity = '0';
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700">
            <svg
              className="w-16 h-16 text-indigo-200 opacity-50"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white line-clamp-2 flex-1">
            {title}
          </h3>
          <span className={`ml-2 px-2.5 py-1 text-xs font-bold rounded-full whitespace-nowrap ${
            event.eventType === 'online'
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
          }`}>
            {event.eventType === 'online' ? '🌐 Online' : '📍 In-Person'}
          </span>
        </div>

        <div className="mb-4 space-y-2">
          {date && (
            <div className="flex items-center gap-3">
              <svg
                className="flex-shrink-0 w-5 h-5 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-sm text-neutral-600 dark:text-gray-300">
                {date}
              </p>
            </div>
          )}
          {event.eventType === 'online' && event.meetingPlatform ? (
            <div className="flex items-center gap-3">
              <svg
                className="flex-shrink-0 w-4 h-4 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-neutral-600 dark:text-gray-300 capitalize">
                {event.meetingPlatform.replace('-', ' ')}
              </p>
            </div>
          ) : null}
          {event.eventType === 'offline' && location && (
            <div className="flex items-center gap-3">
              <svg
                className="flex-shrink-0 w-4 h-4 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-sm text-neutral-600 dark:text-gray-300">
                {location}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 mb-4 text-xs border-t border-neutral-200 dark:border-neutral-700">
          <span className="text-sm font-medium text-neutral-600 dark:text-gray-400">
            {attending} / {capacity} attending
          </span>
        </div>

        <div className="flex gap-2.5 mt-auto">
          {isOwnEvent ? (
            <>
              {onEdit && (
                <Button
                  onClick={() => onEdit(id)}
                  variant="secondary"
                  size="md"
                  className="flex-1 text-lg"
                >
                  Edit
                </Button>
              )}

              {onDelete && (
                <Button
                  onClick={() => onDelete(id)}
                  variant="danger"
                  size="md"
                  className="flex-1 text-lg"
                >
                  Delete
                </Button>
              )}
            </>
          ) : (
            <>
              {onViewDetails && (
                <Button
                  onClick={() => onViewDetails(id)}
                  variant="primary"
                  size="md"
                  className="flex-1 text-lg"
                >
                  View
                </Button>
              )}

              {onRsvp && (
                <Button
                  onClick={() => onRsvp(id)}
                  variant={isJoined ? 'danger' : 'secondary'}
                  size="md"
                  className="flex-1 text-lg"
                  disabled={isFull && !isJoined || loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    isJoined ? 'Leave Event' : isFull ? 'Event Full' : 'RSVP'
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
