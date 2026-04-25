/**
 * Calculates a viral potential score (0-100) based on event attributes
 * Used for event creation form to give users feedback on event appeal
 */
export default function calculateViralScore(formData = {}) {
  let score = 0;

  // Title quality (0-15 points)
  if (formData.title) {
    const titleLength = formData.title.length;
    if (titleLength >= 10 && titleLength <= 60) score += 15;
    else if (titleLength > 5) score += 10;
    else score += 5;
  }

  // Description quality (0-20 points)
  if (formData.description) {
    const descLength = formData.description.length;
    if (descLength >= 100) score += 20;
    else if (descLength >= 50) score += 15;
    else if (descLength >= 20) score += 10;
  }

  // Category relevance (0-15 points)
  const trendingCategories = ['tech', 'music', 'food'];
  if (trendingCategories.includes(formData.category)) score += 15;
  else if (formData.category) score += 10;

  // Capacity optimization (0-15 points)
  if (formData.capacity) {
    const cap = parseInt(formData.capacity);
    if (cap >= 50 && cap <= 500) score += 15;
    else if (cap > 0) score += 10;
  }

  // Event type (0-10 points)
  if (formData.eventType === 'online') score += 10;
  else if (formData.eventType === 'offline') score += 8;

  // Image provided (0-10 points)
  if (formData.imageFile || formData.imageUrl) score += 10;

  // Meeting platform for online events (0-10 points)
  if (formData.eventType === 'online' && formData.meetingPlatform) {
    score += 10;
  }

  // Location quality for offline events (0-5 points)
  if (formData.eventType === 'offline' && formData.location?.length >= 5) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
}
