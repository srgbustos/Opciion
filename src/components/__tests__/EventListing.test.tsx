import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { EventListing } from '../EventListing'

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

describe('EventListing', () => {
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

  it('should render loading state initially', () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: true
    })

    render(<EventListing />)
    
    expect(screen.getByText('Loading events...')).toBeInTheDocument()
  })

  it('should render events list when data is loaded', async () => {
    mockUseQuery.mockReturnValue({
      data: mockEvents,
      isLoading: false
    })

    render(<EventListing />)
    
    await waitFor(() => {
      expect(screen.getByText('Discover Amazing Events')).toBeInTheDocument()
    })
    
    // Should only show future events (filtered out expired ones)
    expect(screen.getByText('Future Tech Event')).toBeInTheDocument()
    expect(screen.getByText('Upcoming Design Event')).toBeInTheDocument()
    expect(screen.queryByText('Past Business Event')).not.toBeInTheDocument()
  })

  it('should filter events based on search query', async () => {
    mockUseQuery.mockReturnValue({
      data: mockEvents,
      isLoading: false
    })

    render(<EventListing />)
    
    const searchInput = screen.getByPlaceholderText('Search events, locations, or keywords...')
    fireEvent.change(searchInput, { target: { value: 'tech' } })
    
    await waitFor(() => {
      expect(screen.getByText('Future Tech Event')).toBeInTheDocument()
      expect(screen.queryByText('Upcoming Design Event')).not.toBeInTheDocument()
    })
  })

  it('should filter events by location', async () => {
    mockUseQuery.mockReturnValue({
      data: mockEvents,
      isLoading: false
    })

    render(<EventListing />)
    
    const searchInput = screen.getByPlaceholderText('Search events, locations, or keywords...')
    fireEvent.change(searchInput, { target: { value: 'Los Angeles' } })
    
    await waitFor(() => {
      expect(screen.getByText('Upcoming Design Event')).toBeInTheDocument()
      expect(screen.queryByText('Future Tech Event')).not.toBeInTheDocument()
    })
  })

  it('should show no events message when no events match search', async () => {
    mockUseQuery.mockReturnValue({
      data: mockEvents,
      isLoading: false
    })

    render(<EventListing />)
    
    const searchInput = screen.getByPlaceholderText('Search events, locations, or keywords...')
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
    
    await waitFor(() => {
      expect(screen.getByText('No events found')).toBeInTheDocument()
    })
  })

  it('should navigate to event details when event card is clicked', async () => {
    mockUseQuery.mockReturnValue({
      data: mockEvents,
      isLoading: false
    })

    render(<EventListing />)
    
    const eventCard = screen.getByText('Future Tech Event').closest('[data-testid="event-card"]') || 
                     screen.getByText('Future Tech Event').closest('div')
    
    if (eventCard) {
      fireEvent.click(eventCard)
      expect(mockNavigate).toHaveBeenCalledWith('/events/1')
    }
  })

  it('should display event details correctly', async () => {
    mockUseQuery.mockReturnValue({
      data: mockEvents,
      isLoading: false
    })

    render(<EventListing />)
    
    await waitFor(() => {
      expect(screen.getByText('Future Tech Event')).toBeInTheDocument()
      expect(screen.getByText('A great tech event')).toBeInTheDocument()
      expect(screen.getByText('San Francisco')).toBeInTheDocument()
      expect(screen.getByText('$50')).toBeInTheDocument()
    })
  })

  it('should show featured badge for featured events', async () => {
    mockUseQuery.mockReturnValue({
      data: mockEvents,
      isLoading: false
    })

    render(<EventListing />)
    
    await waitFor(() => {
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })
  })

  it('should display category badges', async () => {
    mockUseQuery.mockReturnValue({
      data: mockEvents,
      isLoading: false
    })

    render(<EventListing />)
    
    await waitFor(() => {
      expect(screen.getByText('Technology')).toBeInTheDocument()
      expect(screen.getByText('Design')).toBeInTheDocument()
    })
  })

  it('should show free events correctly', async () => {
    mockUseQuery.mockReturnValue({
      data: mockEvents,
      isLoading: false
    })

    render(<EventListing />)
    
    await waitFor(() => {
      expect(screen.getByText('Free')).toBeInTheDocument()
    })
  })
})
