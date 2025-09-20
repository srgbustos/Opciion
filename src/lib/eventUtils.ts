/**
 * Utility functions for event-related operations
 */

/**
 * Checks if an event has expired based on its date and time
 * @param eventDate - The event date (YYYY-MM-DD format)
 * @param eventTime - The event time (HH:MM:SS format)
 * @returns true if the event has expired, false otherwise
 */
export const isEventExpired = (eventDate: string, eventTime: string): boolean => {
  const now = new Date();
  const eventDateTime = new Date(`${eventDate}T${eventTime}Z`); // Use UTC to avoid timezone issues
  
  return eventDateTime <= now;
};

/**
 * Filters out expired events from an array of events
 * @param events - Array of events to filter
 * @returns Array of non-expired events
 */
export const filterExpiredEvents = <T extends { date: string; time: string }>(events: T[]): T[] => {
  return events.filter(event => !isEventExpired(event.date, event.time));
};

/**
 * Gets the time remaining until an event starts
 * @param eventDate - The event date (YYYY-MM-DD format)
 * @param eventTime - The event time (HH:MM:SS format)
 * @returns Object with time remaining or null if event has passed
 */
export const getTimeUntilEvent = (eventDate: string, eventTime: string) => {
  const now = new Date();
  const eventDateTime = new Date(`${eventDate}T${eventTime}Z`); // Use UTC to avoid timezone issues
  
  if (eventDateTime <= now) {
    return null; // Event has passed
  }
  
  const timeDiff = eventDateTime.getTime() - now.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  
  return { days, hours, minutes };
};
