
export const getRsvpUserId = (rsvp) => {
  if (!rsvp) return null;
  if (typeof rsvp === 'string') return rsvp;
  if (typeof rsvp === 'object' && (rsvp._id || rsvp.id)) {
    return rsvp._id || rsvp.id;
  }
  return null;
};

export const isUserRsvped = (event, userId) => {
  if (!event || !userId) {
    return false;
  }
  
  // Ensure rsvps is an array
  const rsvps = Array.isArray(event.rsvps) ? event.rsvps : [];
  if (rsvps.length === 0) {
    return false;
  }
  
  const isRsvped = rsvps.some((rsvp) => {
    const rsvpId = getRsvpUserId(rsvp);
    if (!rsvpId) return false;
    
    const match = String(rsvpId).trim() === String(userId).trim();
    return match;
  });
  
  return isRsvped;
};

export const getRsvpCount = (event) => {
  const rsvps = Array.isArray(event?.rsvps) ? event.rsvps : [];
  return rsvps.length;
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
