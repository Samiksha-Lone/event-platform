/**
 * Provides time-based suggestions for event creation
 * Returns encouraging messages based on current time
 */
export default function getTimeSuggestion() {
  const hour = new Date().getHours();

  if (hour < 6) {
    return "Night owl? Schedule an early morning event!";
  } else if (hour < 9) {
    return "Breakfast event? Great timing!";
  } else if (hour < 12) {
    return "Morning events are popular. Go for it!";
  } else if (hour < 14) {
    return "Lunch hour is great for events!";
  } else if (hour < 17) {
    return "Afternoon is perfect for workshops!";
  } else if (hour < 19) {
    return "Evening events attract working professionals!";
  } else if (hour < 22) {
    return "Night events are trending. Perfect timing!";
  } else {
    return "Late night events are unique. Try it!";
  }
}
