import Card from './Card';
import Button from './Button';


export default function EventCard({ event, onViewDetails, onRsvp, isOwnEvent = false, onEdit = null, onDelete = null }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-center flex-shrink-0 w-full h-56 mb-6 bg-gradient-to-br from-indigo-200 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800 rounded-xl">
        <svg className="w-16 h-16 text-indigo-500 dark:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
        </svg>
      </div>

      <h3 className="mb-4 text-xl font-bold text-neutral-900 dark:text-neutral-50">
        {event.title}
      </h3>

      <div className="flex items-center gap-3 mb-3 text-base text-neutral-600 dark:text-neutral-400">
        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
        </svg>
        <span>{event.date} at {event.time}</span>
      </div>

      <div className="flex items-center gap-3 mb-4 text-base text-neutral-600 dark:text-neutral-400">
        <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span>{event.location}</span>
      </div>

      <div className="mb-6 text-base font-medium text-neutral-600 dark:text-neutral-400">
        {event.attending} / {event.capacity} attending
      </div>

      <div className="flex gap-3 mt-auto">
        {isOwnEvent ? (
          <>
            <Button onClick={onEdit} variant="primary" size="md" className="flex-1">
              Edit
            </Button>
            <Button onClick={onDelete} variant="danger" size="md" className="flex-1">
              Delete
            </Button>
          </>
        ) : (
          
          <>
            <Button onClick={onViewDetails} variant="primary" size="md" className="flex-1">
              View
            </Button>
            <Button onClick={onRsvp} variant="secondary" size="md" className="flex-1">
              RSVP
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
