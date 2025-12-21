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
}) {
  const id = event._id || event.id;
  const title = event.title || event.name || 'Untitled Event';
  const date = event.date || event.datetime || '';
  const location = event.location || '';
  const capacity =
    event.capacity || event.capacity === 0 ? event.capacity : '-';
  const attending = event.attending ?? (event.rsvps ? event.rsvps.length : 0);

  return (
    <div className="flex flex-col h-full overflow-hidden transition-all duration-200 bg-white border rounded-2xl dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:shadow-2xl hover:border-indigo-500/50 dark:hover:border-indigo-500/30">
      {/* Image */}
      <div className="relative flex items-center justify-center flex-shrink-0 w-full h-64 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700">
        {event.image ? (
          <img
            src={event.image}
            alt={title}
            className="object-cover w-full h-full"
            onError={(e) => {
              e.target.style.opacity = '0';
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <svg
              className="w-24 h-24 text-indigo-200 opacity-50"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="mb-5 text-2xl font-bold text-neutral-900 dark:text-white line-clamp-2">
          {title}
        </h3>

        <div className="mb-6 space-y-3">
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
              <p className="text-base text-neutral-600 dark:text-gray-300">
                {date}
              </p>
            </div>
          )}
          {location && (
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p className="text-base text-neutral-600 dark:text-gray-300">
                {location}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 mb-6 text-sm border-t border-neutral-200 dark:border-neutral-700">
          <span className="text-sm font-medium text-neutral-600 dark:text-gray-400">
            {attending} / {capacity} attending
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto">
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
                  disabled={isFull && !isJoined}
                >
                  {isJoined ? 'Leave Event' : isFull ? 'Event Full' : 'RSVP'}
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
