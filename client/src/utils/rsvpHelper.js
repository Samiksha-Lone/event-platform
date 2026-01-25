
export const getRsvpUserId = (rsvp) => {
  if (!rsvp) return null;
  if (typeof rsvp === 'string') return rsvp;
  return rsvp._id || rsvp.id || null;
};

export const isUserRsvped = (event, userId) => {
  if (!event || !event.rsvps || !userId) {
    return false;
  }
  
  const isRsvped = event.rsvps.some((rsvp) => {
    const rsvpId = getRsvpUserId(rsvp);
    const match = rsvpId && String(rsvpId) === String(userId);
    
    
    return match;
  });
  
  
  return isRsvped;
};

export const getRsvpCount = (event) => {
  return event?.rsvps?.length || 0;
};

export const isEventFull = (event) => {
  const rsvpCount = getRsvpCount(event);
  const capacity = event?.capacity || 0;
  return rsvpCount >= capacity;
};

export const getAvailableSpots = (event) => {
  const rsvpCount = getRsvpCount(event);
  const capacity = event?.capacity || 0;
  return Math.max(0, capacity - rsvpCount);
};
