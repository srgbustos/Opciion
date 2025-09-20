import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { EventListing } from '../../components/EventListing'
import { DiscoverLanding } from '../../components/DiscoverLanding'

// Mock the useQuery hook
const mockUseQuery = vi.fn()
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => mockUseQuery()
}))

// Mock the useNavigate hook
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate
  }
})

describe('Event Filtering Integration Tests', () => {
  const mockEvents = [
    {
      id: '1',
      title: 'Future Tech Event',
      description: 'A great tech event',
      location: 'San Francisco',
      date: '2024-01-20',
      time: '14:00:00',
      price: 50,
      currency: 'USD',
      capacity: 100,
      category: 'Technology',
      featured: true,
      status: 'published'
    },
    {
      id: '2',
      title: 'Past Business Event',
      description: 'A business event that already happened',
      location: 'New York',
      date: '2024-01-10',
      time: '10:00:00',
      price: 25,
      currency: 'USD',
      capacity: 50,
      category: 'Business',
      featured: false,
      status: 'published'
    },
    {
      id: '3',
      title: 'Upcoming Design Event',
      description: 'A design workshop',
      location: 'Los Angeles',
      date: '2024-01-25',
      time: '16:00:00',
      price: 0,
      currency: 'USD',
      capacity: 30,
      category: 'Design',
      featured: true,
      status: 'published'
    },
    {
      id: '4',
      title: 'Today Past Event',
      description: 'An event that happened earlier today',
      location: 'Chicago',
      date: '2024-01-15',
      time: '08:00:00',
      price: 15,
      currency: 'USD',
      capacity: 20,
      category: 'Education',
      featured: false,
      status: 'published'
    },
    {
      id: '5',
      title: 'Today Future Event',
      description: 'An event happening later today',
      location: 'Miami',
      date: '2024-01-15',
      time: '18:00:00',
      price: 30,
      currency: 'USD',
      capacity: 40,
      category: 'Outdoor',
      featured: false,
      status: 'published'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock current date to 2024-01-15 12:00:00
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('EventListing Component Integration', () => {
    it('should filter out all expired events and show only future events', async () => {
      mockUseQuery.mockReturnValue({
        data: mockEvents,
        isLoading: false
      })

      render(<EventListing />)
      
      await waitFor(() => {
        // Should show future events
        expect(screen.getByText('Future Tech Event')).toBeInTheDocument()
        expect(screen.getByText('Upcoming Design Event')).toBeInTheDocument()
        expect(screen.getByText('Today Future Event')).toBeInTheDocument()
        
        // Should not show past events
        expect(screen.queryByText('Past Business Event')).not.toBeInTheDocument()
        expect(screen.queryByText('Today Past Event')).not.toBeInTheDocument()
      })
    })

    it('should combine search filtering with expiration filtering', async () => {
      mockUseQuery.mockReturnValue({
        data: mockEvents,
        isLoading: false
      })

      render(<EventListing />)
      
      // Search for tech events
      const searchInput = screen.getByPlaceholderText('Search events, locations, or keywords...')
      fireEvent.change(searchInput, { target: { value: 'tech' } })
      
      await waitFor(() => {
        // Should only show future tech events
        expect(screen.getByText('Future Tech Event')).toBeInTheDocument()
        expect(screen.queryByText('Upcoming Design Event')).not.toBeInTheDocument()
        expect(screen.queryByText('Today Future Event')).not.toBeInTheDocument()
      })
    })

    it('should show no events message when all events are expired', async () => {
      const allPastEvents = [
        {
          id: '1',
          title: 'Past Event 1',
          description: 'Old event',
          location: 'City 1',
          date: '2024-01-10',
          time: '10:00:00',
          price: 10,
          currency: 'USD',
          capacity: 10,
          category: 'Technology',
          featured: false,
          status: 'published'
        },
        {
          id: '2',
          title: 'Past Event 2',
          description: 'Another old event',
          location: 'City 2',
          date: '2024-01-12',
          time: '14:00:00',
          price: 20,
          currency: 'USD',
          capacity: 20,
          category: 'Business',
          featured: false,
          status: 'published'
        }
      ]

      mockUseQuery.mockReturnValue({
        data: allPastEvents,
        isLoading: false
      })

      render(<EventListing />)
      
      await waitFor(() => {
        expect(screen.getByText('No events available yet')).toBeInTheDocument()
      })
    })
  })

  describe('DiscoverLanding Component Integration', () => {
    it('should filter out expired events from featured events', async () => {
      mockUseQuery.mockReturnValue({
        data: mockEvents.filter(event => event.featured),
        isLoading: false
      })

      render(<DiscoverLanding />)
      
      await waitFor(() => {
        // Should show future featured events
        expect(screen.getByText('Future Tech Event')).toBeInTheDocument()
        expect(screen.getByText('Upcoming Design Event')).toBeInTheDocument()
        
        // Should not show past featured events (none in this test data)
      })
    })

    it('should handle search filtering with expiration filtering for featured events', async () => {
      mockUseQuery.mockReturnValue({
        data: mockEvents.filter(event => event.featured),
        isLoading: false
      })

      render(<DiscoverLanding />)
      
      // Search for design events
      const searchInput = screen.getByPlaceholderText('Search events, locations, or keywords...')
      fireEvent.change(searchInput, { target: { value: 'design' } })
      
      await waitFor(() => {
        // Should only show future design events
        expect(screen.getByText('Upcoming Design Event')).toBeInTheDocument()
        expect(screen.queryByText('Future Tech Event')).not.toBeInTheDocument()
      })
    })
  })

  describe('Edge Cases', () => {
    it('should handle events with exact current time as expired', async () => {
      const exactTimeEvent = {
        id: '6',
        title: 'Exact Time Event',
        description: 'Event at exact current time',
        location: 'Test City',
        date: '2024-01-15',
        time: '12:00:00',
        price: 10,
        currency: 'USD',
        capacity: 10,
        category: 'Technology',
        featured: false,
        status: 'published'
      }

      mockUseQuery.mockReturnValue({
        data: [exactTimeEvent],
        isLoading: false
      })

      render(<EventListing />)
      
      await waitFor(() => {
        expect(screen.getByText('No events available yet')).toBeInTheDocument()
      })
    })

    it('should handle events with invalid date formats gracefully', async () => {
      const invalidDateEvent = {
        id: '7',
        title: 'Invalid Date Event',
        description: 'Event with invalid date',
        location: 'Test City',
        date: 'invalid-date',
        time: '14:00:00',
        price: 10,
        currency: 'USD',
        capacity: 10,
        category: 'Technology',
        featured: false,
        status: 'published'
      }

      mockUseQuery.mockReturnValue({
        data: [invalidDateEvent],
        isLoading: false
      })

      render(<EventListing />)
      
      await waitFor(() => {
        // Should handle gracefully and show the event (assuming it's treated as future)
        expect(screen.getByText('Invalid Date Event')).toBeInTheDocument()
      })
    })

    it('should handle empty events array', async () => {
      mockUseQuery.mockReturnValue({
        data: [],
        isLoading: false
      })

      render(<EventListing />)
      
      await waitFor(() => {
        expect(screen.getByText('No events available yet')).toBeInTheDocument()
      })
    })
  })
})
