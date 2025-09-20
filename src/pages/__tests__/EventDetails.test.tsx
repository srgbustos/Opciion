import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { EventDetails } from '../EventDetails'

// Mock the useQuery hook
const mockUseQuery = vi.fn()
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => mockUseQuery()
}))

// Mock the useParams hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: 'test-event-id' }),
    useNavigate: () => vi.fn()
  }
})

describe('EventDetails', () => {
  const mockEvent = {
    id: 'test-event-id',
    title: 'Amazing Tech Conference',
    description: 'Join us for an incredible tech conference with industry leaders',
    date: '2024-01-20',
    time: '14:00:00',
    location: 'San Francisco Convention Center',
    price: 150,
    currency: 'USD',
    capacity: 500,
    category: 'Technology',
    featured: true,
    status: 'published',
    organizer_id: 'organizer-123'
  }

  const mockOrganizer = {
    display_name: 'John Doe',
    avatar_url: 'https://example.com/avatar.jpg'
  }

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
    mockUseQuery
      .mockReturnValueOnce({ data: undefined, isLoading: true }) // event query
      .mockReturnValueOnce({ data: null, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    expect(screen.getByText('Loading event details...')).toBeInTheDocument()
  })

  it('should render event details when data is loaded', async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Amazing Tech Conference')).toBeInTheDocument()
      expect(screen.getByText('Join us for an incredible tech conference with industry leaders')).toBeInTheDocument()
      expect(screen.getByText('San Francisco Convention Center')).toBeInTheDocument()
      expect(screen.getByText('$150')).toBeInTheDocument()
    })
  })

  it('should show registration button for future events', async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Register Now')).toBeInTheDocument()
    })
  })

  it('should show "Event Has Passed" button for expired events', async () => {
    const pastEvent = {
      ...mockEvent,
      date: '2024-01-10',
      time: '10:00:00'
    }

    mockUseQuery
      .mockReturnValueOnce({ data: pastEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Event Has Passed')).toBeInTheDocument()
      expect(screen.queryByText('Register Now')).not.toBeInTheDocument()
    })
  })

  it('should show registered status when user is already registered', async () => {
    const mockRegistration = {
      id: 'reg-123',
      ticket_number: 'TICKET-123456',
      status: 'confirmed'
    }

    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: mockRegistration, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText("You're Registered!")).toBeInTheDocument()
      expect(screen.getByText('TICKET-123456')).toBeInTheDocument()
    })
  })

  it('should display organizer information', async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Meet Your Host')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('should display event date and time correctly', async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Saturday, January 20, 2024')).toBeInTheDocument()
      expect(screen.getByText('14:00:00')).toBeInTheDocument()
    })
  })

  it('should display event capacity information', async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('500 spots available')).toBeInTheDocument()
    })
  })

  it('should show featured badge for featured events', async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Featured Event')).toBeInTheDocument()
    })
  })

  it('should display event category', async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Technology')).toBeInTheDocument()
    })
  })

  it('should show free events correctly', async () => {
    const freeEvent = {
      ...mockEvent,
      price: 0
    }

    mockUseQuery
      .mockReturnValueOnce({ data: freeEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Free')).toBeInTheDocument()
    })
  })

  it('should handle registration loading state', async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    const registerButton = screen.getByText('Register Now')
    fireEvent.click(registerButton)
    
    await waitFor(() => {
      expect(screen.getByText('Registering...')).toBeInTheDocument()
    })
  })

  it('should show back button', async () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockEvent, isLoading: false }) // event query
      .mockReturnValueOnce({ data: mockOrganizer, isLoading: false }) // organizer query
      .mockReturnValueOnce({ data: null, isLoading: false }) // registration query

    render(<EventDetails />)
    
    await waitFor(() => {
      expect(screen.getByText('Back to Events')).toBeInTheDocument()
    })
  })
})
