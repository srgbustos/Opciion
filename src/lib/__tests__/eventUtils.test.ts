import { describe, it, expect, vi, beforeEach } from 'vitest'
import { isEventExpired, filterExpiredEvents, getTimeUntilEvent } from '../eventUtils'

describe('eventUtils', () => {
  beforeEach(() => {
    // Mock current date to 2024-01-15 12:00:00 UTC
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('isEventExpired', () => {
    it('should return true for events that have already passed', () => {
      const pastDate = '2024-01-14'
      const pastTime = '10:00:00'
      
      expect(isEventExpired(pastDate, pastTime)).toBe(true)
    })

    it('should return false for events that are in the future', () => {
      const futureDate = '2024-01-16'
      const futureTime = '14:00:00'
      
      expect(isEventExpired(futureDate, futureTime)).toBe(false)
    })

    it('should return false for events happening today but later', () => {
      const todayDate = '2024-01-15'
      const laterTime = '15:00:00'
      
      expect(isEventExpired(todayDate, laterTime)).toBe(false)
    })

    it('should return true for events happening today but earlier', () => {
      const todayDate = '2024-01-15'
      const earlierTime = '10:00:00'
      
      expect(isEventExpired(todayDate, earlierTime)).toBe(true)
    })

    it('should handle edge case of exact current time', () => {
      const todayDate = '2024-01-15'
      const currentTime = '12:00:00'
      
      // Event at exact current time should be considered expired
      expect(isEventExpired(todayDate, currentTime)).toBe(true)
    })
  })

  describe('filterExpiredEvents', () => {
    it('should filter out expired events from an array', () => {
      const events = [
        { id: '1', date: '2024-01-14', time: '10:00:00', title: 'Past Event' },
        { id: '2', date: '2024-01-16', time: '14:00:00', title: 'Future Event' },
        { id: '3', date: '2024-01-15', time: '10:00:00', title: 'Today Past Event' },
        { id: '4', date: '2024-01-15', time: '15:00:00', title: 'Today Future Event' }
      ]

      const result = filterExpiredEvents(events)
      
      expect(result).toHaveLength(2)
      expect(result.map(e => e.title)).toEqual(['Future Event', 'Today Future Event'])
    })

    it('should return empty array when all events are expired', () => {
      const events = [
        { id: '1', date: '2024-01-14', time: '10:00:00', title: 'Past Event 1' },
        { id: '2', date: '2024-01-14', time: '15:00:00', title: 'Past Event 2' }
      ]

      const result = filterExpiredEvents(events)
      
      expect(result).toHaveLength(0)
    })

    it('should return all events when none are expired', () => {
      const events = [
        { id: '1', date: '2024-01-16', time: '10:00:00', title: 'Future Event 1' },
        { id: '2', date: '2024-01-17', time: '15:00:00', title: 'Future Event 2' }
      ]

      const result = filterExpiredEvents(events)
      
      expect(result).toHaveLength(2)
      expect(result).toEqual(events)
    })

    it('should handle empty array', () => {
      const events: Array<{ date: string; time: string }> = []
      
      const result = filterExpiredEvents(events)
      
      expect(result).toHaveLength(0)
    })
  })

  describe('getTimeUntilEvent', () => {
    it('should return null for events that have already passed', () => {
      const pastDate = '2024-01-14'
      const pastTime = '10:00:00'
      
      const result = getTimeUntilEvent(pastDate, pastTime)
      
      expect(result).toBeNull()
    })

    it('should calculate correct time remaining for future events', () => {
      const futureDate = '2024-01-16'
      const futureTime = '14:00:00'
      
      const result = getTimeUntilEvent(futureDate, futureTime)
      
      expect(result).toEqual({
        days: 1,
        hours: 2,
        minutes: 0
      })
    })

    it('should calculate correct time remaining for same day future events', () => {
      const todayDate = '2024-01-15'
      const futureTime = '15:30:00'
      
      const result = getTimeUntilEvent(todayDate, futureTime)
      
      expect(result).toEqual({
        days: 0,
        hours: 3,
        minutes: 30
      })
    })

    it('should handle events happening in the next minute', () => {
      const todayDate = '2024-01-15'
      const futureTime = '12:00:30'
      
      const result = getTimeUntilEvent(todayDate, futureTime)
      
      expect(result).toEqual({
        days: 0,
        hours: 0,
        minutes: 0
      })
    })
  })
})
