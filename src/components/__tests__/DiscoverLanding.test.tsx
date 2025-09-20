import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { DiscoverLanding } from '../DiscoverLanding'

// Mock the useQuery hook
const mockUseQuery = vi.fn()
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => mockUseQuery()
}))

describe('DiscoverLanding', () => {
  const mockFeaturedEvents = [
    {
      id: '1',
      title: 'Featured Tech Summit',
      description: 'The biggest tech event of the year',
      location: 'San Francisco',
      date: '2024-01-20',
      time: '14:00:00',
      price: 100,
      currency: 'USD',
      capacity: 500,
      category: 'Technology',
      featured: true,
      status: 'published'
    },
    {
      id: '2',
      title: 'Past Featured Event',
      description: 'This event already happened',
      location: 'New York',
      date: '2024-01-10',
      time: '10:00:00',
      price: 75,
      currency: 'USD',
      capacity: 200,
      category: 'Business',
      featured: true,
      status: 'published'
    },
    {
      id: '3',
      title: 'Design Workshop',
      description: 'Learn design principles',
      location: 'Los Angeles',
      date: '2024-01-25',
      time: '16:00:00',
      price: 0,
      currency: 'USD',
      capacity: 30,
      category: 'Design',
      featured: true,
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

  it('should render hero section with correct content', () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    expect(screen.getByText('Discover Amazing Events')).toBeInTheDocument()
    expect(screen.getByText('Find and join events that match your interests and expand your horizons')).toBeInTheDocument()
  })

  it('should render featured events section', async () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    await waitFor(() => {
      expect(screen.getByText('Featured Events')).toBeInTheDocument()
    })
  })

  it('should filter out expired events from featured events', async () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    await waitFor(() => {
      // Should show future events
      expect(screen.getByText('Featured Tech Summit')).toBeInTheDocument()
      expect(screen.getByText('Design Workshop')).toBeInTheDocument()
      
      // Should not show past events
      expect(screen.queryByText('Past Featured Event')).not.toBeInTheDocument()
    })
  })

  it('should filter events based on search query', async () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    const searchInput = screen.getByPlaceholderText('Search events, locations, or keywords...')
    fireEvent.change(searchInput, { target: { value: 'tech' } })
    
    await waitFor(() => {
      expect(screen.getByText('Featured Tech Summit')).toBeInTheDocument()
      expect(screen.queryByText('Design Workshop')).not.toBeInTheDocument()
    })
  })

  it('should display event cards with correct information', async () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    await waitFor(() => {
      expect(screen.getByText('Featured Tech Summit')).toBeInTheDocument()
      expect(screen.getByText('The biggest tech event of the year')).toBeInTheDocument()
      expect(screen.getByText('San Francisco')).toBeInTheDocument()
      expect(screen.getByText('$100')).toBeInTheDocument()
    })
  })

  it('should show free events correctly', async () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    await waitFor(() => {
      expect(screen.getByText('Free')).toBeInTheDocument()
    })
  })

  it('should display category badges', async () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    await waitFor(() => {
      expect(screen.getByText('Technology')).toBeInTheDocument()
      expect(screen.getByText('Design')).toBeInTheDocument()
    })
  })

  it('should render call-to-action buttons', () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    expect(screen.getByText('Browse All Events')).toBeInTheDocument()
    expect(screen.getByText('Create Event')).toBeInTheDocument()
  })

  it('should render statistics section', () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    expect(screen.getByText('10K+')).toBeInTheDocument()
    expect(screen.getByText('Events Hosted')).toBeInTheDocument()
    expect(screen.getByText('50K+')).toBeInTheDocument()
    expect(screen.getByText('Happy Attendees')).toBeInTheDocument()
  })

  it('should render categories section', () => {
    mockUseQuery.mockReturnValue({
      data: mockFeaturedEvents,
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Business')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
    expect(screen.getByText('Outdoor')).toBeInTheDocument()
    expect(screen.getByText('Education')).toBeInTheDocument()
  })

  it('should handle empty events list gracefully', async () => {
    mockUseQuery.mockReturnValue({
      data: [],
      isLoading: false
    })

    render(<DiscoverLanding />)
    
    await waitFor(() => {
      expect(screen.getByText('No featured events available')).toBeInTheDocument()
    })
  })
})
