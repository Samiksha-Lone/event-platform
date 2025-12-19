import React from 'react';
import Button from './Button';
import Card from './Card';

export default function EventCard({
  event = {},
  onViewDetails = () => {},
  onRsvp = () => {},
  isOwnEvent = false,
  onEdit = null,
  onDelete = null,
  isJoined = false,
  isFull = false,
}) {
  const id = event._id || event.id;
  const title = event.title || event.name || 'Untitled Event';
  const date = event.date || event.datetime || '';
  const location = event.location || '';
  const capacity = event.capacity || event.capacity === 0 ? event.capacity : '-';
  const attending = event.attending ?? (event.rsvps ? event.rsvps.length : 0);

  // return (
  //   <Card className="flex flex-col h-full p-4">
  //     <div className="flex-1">
  //       <h3 className="mb-2 text-lg font-semibold">{title}</h3>
  //       {date && <p className="mb-1 text-sm text-neutral-600">{date}</p>}
  //       {location && <p className="mb-2 text-sm text-neutral-600">{location}</p>}
  //       {event.description && (
  //         <p className="mb-4 text-sm text-neutral-700">{event.description}</p>
  //       )}
  //     </div>

  //     <div className="flex items-center justify-between mb-3 text-sm text-neutral-600">
  //       <div>Capacity: {capacity}</div>
  //       <div>Attending: {attending}</div>
  //     </div>

  //     <div className="flex gap-3 mt-auto">
  //       {isOwnEvent ? (
  //         <>
  //           <Button onClick={() => onEdit && onEdit(id)} variant="primary" size="md" className="flex-1">
  //             Edit
  //           </Button>
  //           <Button onClick={() => onDelete && onDelete(id)} variant="danger" size="md" className="flex-1">
  //             Delete
  //           </Button>
  //         </>
  //       ) : (
  //         <>
  //           <Button onClick={() => onViewDetails && onViewDetails(id)} variant="primary" size="md" className="flex-1">
  //             View
  //           </Button>
  //           <Button
  //             onClick={() => onRsvp && onRsvp(id)}
  //             variant="secondary"
  //             size="md"
  //             className="flex-1"
  //             disabled={isFull && !isJoined}
  //           >
  //             {isJoined ? 'Leave' : isFull ? 'Full' : 'RSVP'}
  //           </Button>
  //         </>
  //       )}
  //     </div>
  //   </Card>
  // );

//   return (
//   <Card className="flex flex-col h-full overflow-hidden">
//     {/* Image */}
//     {event.imageUrl && (
//       <div className="w-full h-40 overflow-hidden">
//         <img
//           src={event.imageUrl}
//           alt={title}
//           className="object-cover w-full h-full"
//         />
//       </div>
//     )}

//     {/* Content */}
//     <div className="flex flex-col flex-1 p-4">
//       <div className="flex-1">
//         <h3 className="mb-2 text-lg font-semibold">{title}</h3>
//         {date && (
//           <p className="mb-1 text-sm text-neutral-600">
//             {date}
//           </p>
//         )}
//         {location && (
//           <p className="mb-2 text-sm text-neutral-600">
//             {location}
//           </p>
//         )}
//         {event.description && (
//           <p className="mb-4 text-sm text-neutral-700 line-clamp-3">
//             {event.description}
//           </p>
//         )}
//       </div>

//       <div className="flex items-center justify-between mb-3 text-sm text-neutral-600">
//         <div>Capacity: {capacity}</div>
//         <div>Attending: {attending}</div>
//       </div>

//       {/* Actions */}
//       <div className="flex gap-3 mt-auto">
//         <Button
//           onClick={() => onViewDetails && onViewDetails(id)}
//           variant="primary"
//           size="md"
//           className="flex-1"
//         >
//           View
//         </Button>

//         <Button
//           onClick={() => onRsvp && onRsvp(id)}
//           variant="secondary"
//           size="md"
//           className="flex-1"
//           disabled={isFull && !isJoined}
//         >
//           {isJoined ? 'Leave' : isFull ? 'Full' : 'RSVP'}
//         </Button>

//         {isOwnEvent && (
//           <>
//             <Button
//               onClick={() => onEdit && onEdit(id)}
//               variant="ghost"
//               size="md"
//               className="px-3"
//             >
//               Edit
//             </Button>
//             <Button
//               onClick={() => onDelete && onDelete(id)}
//               variant="danger"
//               size="md"
//               className="px-3"
//             >
//               Delete
//             </Button>
//           </>
//         )}
//       </div>
//     </div>
//   </Card>
// );

  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 transition-all duration-200 hover:shadow-2xl hover:border-indigo-500/50 dark:hover:border-indigo-500/30 flex flex-col h-full">
      {/* Image Container - Gradient placeholder */}
      <div className="w-full h-64 relative overflow-hidden flex-shrink-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-indigo-700 flex items-center justify-center">
        {event.image ? (
          <img
            src={event.image}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.opacity = '0';
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
          <svg className="w-24 h-24 text-indigo-200 opacity-50" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 5a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
          </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 flex-1">
        {/* Title */}
        <h3 className="mb-5 text-xl font-bold text-neutral-900 dark:text-white line-clamp-2">{title}</h3>
        
        {/* Date & Location */}
        <div className="space-y-3 mb-6">
          {date && (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-neutral-600 dark:text-gray-300">{date}</p>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-neutral-600 dark:text-gray-300">{location}</p>
            </div>
          )}
        </div>

        {/* Attending Info */}
        <div className="flex items-center justify-between mb-6 text-sm border-t border-neutral-200 dark:border-neutral-700 pt-4">
          <span className="text-neutral-600 dark:text-gray-400 text-xs font-medium">{attending} / {capacity} attending</span>
        </div>

        {/* Actions - View and RSVP side by side */}
        <div className="flex gap-3 mt-auto">
          <Button
            onClick={() => onViewDetails && onViewDetails(id)}
            variant="primary"
            size="md"
            className="flex-1 text-base"
          >
            View
          </Button>

          <Button
            onClick={() => onRsvp && onRsvp(id)}
            variant="secondary"
            size="md"
            className="flex-1 text-base"
            disabled={isFull && !isJoined}
          >
            {isJoined ? 'Leave' : isFull ? 'Full' : 'RSVP'}
          </Button>
        </div>
      </div>
    </div>
  );

  
}
