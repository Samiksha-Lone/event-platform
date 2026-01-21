import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const CalendarView = ({ events }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = [];
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  for (let i = 0; i < startDay; i++) {
    days.push({ day: null, month: 'prev' });
  }

  for (let d = 1; d <= totalDays; d++) {
    days.push({ day: d, month: 'current' });
  }

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getEventsForDay = (day) => {
    if (!day) return [];
    return events.filter(ev => {
      const evDate = new Date(ev.date);
      return (
        evDate.getDate() === day &&
        evDate.getMonth() === month &&
        evDate.getFullYear() === year
      );
    });
  };

  return (
    <div className="overflow-hidden bg-white border shadow-sm dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 rounded-2xl">
      <div className="flex items-center justify-between p-4 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          {monthNames[month]} <span className="font-medium text-neutral-400">{year}</span>
        </h3>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-xs font-bold text-indigo-600 transition-colors rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 transition-colors rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/30">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="py-3 text-center text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 bg-neutral-100 dark:bg-neutral-800 gap-[1px]">
        {days.map((item, idx) => {
          const dayEvents = getEventsForDay(item.day);
          const isToday = item.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

          return (
            <div
              key={idx}
              className={`min-h-[120px] bg-white dark:bg-neutral-900 p-2 border-neutral-100 dark:border-neutral-800 transition-colors ${!item.day ? 'bg-neutral-50/30 dark:bg-neutral-900/30' : 'hover:bg-indigo-50/10 dark:hover:bg-indigo-900/5'
                }`}
            >
              {item.day && (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-bold ${isToday
                        ? 'w-7 h-7 flex items-center justify-center bg-indigo-600 text-white rounded-full'
                        : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                      {item.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-black text-indigo-500 uppercase">
                        {dayEvents.length} Event{dayEvents.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map(ev => (
                      <Link
                        key={ev._id}
                        to={`/event/${ev._id}`}
                        className="block px-2 py-1 text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded border border-indigo-100 dark:border-indigo-800 truncate hover:scale-105 transition-transform"
                      >
                        {ev.title}
                      </Link>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[9px] text-center text-neutral-400 font-bold">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
