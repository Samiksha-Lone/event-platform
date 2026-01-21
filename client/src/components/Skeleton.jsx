import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
  const baseClasses = 'animate-pulse bg-neutral-200 dark:bg-neutral-800';
  
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'h-4 rounded w-full',
  };

  return (
    <div className={`${baseClasses} ${variants[variant]} ${className}`} />
  );
};

export const EventCardSkeleton = () => (
  <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm p-0">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-5 space-y-4">
      <Skeleton variant="text" className="w-3/4 h-6" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-1/2" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
      <div className="pt-4 flex justify-between items-center">
        <Skeleton className="h-10 w-24 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  </div>
);

export default Skeleton;
