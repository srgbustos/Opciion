import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/test-utils'
import userEvent from '@testing-library/user-event'
import { EventCreationForm } from '../EventCreationForm'

// Mock the image upload utility
vi.mock('@/lib/imageUpload', () => ({
  uploadImageToStorage: vi.fn(),
  validateImageFile: vi.fn(),
  formatFileSize: vi.fn()
}))

// Mock the rich text editor
vi.mock('@/components/ui/rich-text-editor', () => ({
  RichTextEditor: ({ value, onChange, placeholder }: any) => (
    <textarea
      data-testid="rich-text-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}))

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

describe('EventCreationForm', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com'
  }

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
  })

  describe('Authentication', () => {
    it('should show sign-in prompt when user is not authenticated', () => {
      // Mock unauthenticated user
      vi.doMock('@/hooks/useAuth', () => ({
        useAuth: () => ({
          user: null,
          loading: false,
          signIn: vi.fn(),
          signOut: vi.fn(),
          signUp: vi.fn()
        })
      }))

      render(<EventCreationForm />)
      
      expect(screen.getByText('Ready to Create Your Event?')).toBeInTheDocument()
      expect(screen.getByText('Sign In to Create Event')).toBeInTheDocument()
    })

    it('should show form when user is authenticated', () => {
      // Mock authenticated user
      vi.doMock('@/hooks/useAuth', () => ({
        useAuth: () => ({
          user: mockUser,
          loading: false,
          signIn: vi.fn(),
          signOut: vi.fn(),
          signUp: vi.fn()
        })
      }))

      render(<EventCreationForm />)
      
      expect(screen.getByText('Build Your Perfect Event')).toBeInTheDocument()
      expect(screen.getByText('Event Basics')).toBeInTheDocument()
    })
  })

  describe('Form Structure', () => {
    it('should render all 7 tabs', () => {
      render(<EventCreationForm />)
      
      expect(screen.getByText('Event Basics')).toBeInTheDocument()
      expect(screen.getByText('Media')).toBeInTheDocument()
      expect(screen.getByText('FAQ')).toBeInTheDocument()
      expect(screen.getByText('Tickets')).toBeInTheDocument()
      expect(screen.getByText('Order Form')).toBeInTheDocument()
      expect(screen.getByText('Confirmation')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
    })

    it('should start with Event Basics tab active', () => {
      render(<EventCreationForm />)
      
      expect(screen.getByText('Event Information')).toBeInTheDocument()
      expect(screen.getByLabelText('Event Title *')).toBeInTheDocument()
    })
  })

  describe('Event Basics Tab', () => {
    it('should render all required fields', () => {
      render(<EventCreationForm />)
      
      expect(screen.getByLabelText('Event Title *')).toBeInTheDocument()
      expect(screen.getByLabelText('Location *')).toBeInTheDocument()
      expect(screen.getByLabelText('Short Description *')).toBeInTheDocument()
      expect(screen.getByLabelText('Overview *')).toBeInTheDocument()
      expect(screen.getByLabelText('Start Date *')).toBeInTheDocument()
      expect(screen.getByLabelText('End Date *')).toBeInTheDocument()
      expect(screen.getByLabelText('Primary Event Date *')).toBeInTheDocument()
    })

    it('should validate required fields', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Event title is required')).toBeInTheDocument()
        expect(screen.getByText('Location is required')).toBeInTheDocument()
        expect(screen.getByText('Short description is required')).toBeInTheDocument()
        expect(screen.getByText('Overview is required')).toBeInTheDocument()
      })
    })

    it('should validate title length', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      const titleInput = screen.getByLabelText('Event Title *')
      await user.type(titleInput, 'a'.repeat(121))
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Title must be less than 120 characters')).toBeInTheDocument()
      })
    })

    it('should validate short description length', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      const descriptionInput = screen.getByLabelText('Short Description *')
      await user.type(descriptionInput, 'a'.repeat(281))
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Short description must be less than 280 characters')).toBeInTheDocument()
      })
    })

    it('should validate date range', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      const startDateInput = screen.getByLabelText('Start Date *')
      const endDateInput = screen.getByLabelText('End Date *')
      const primaryDateInput = screen.getByLabelText('Primary Event Date *')
      
      await user.type(startDateInput, '2025-11-16')
      await user.type(endDateInput, '2025-11-14') // End before start
      await user.type(primaryDateInput, '2025-11-15')
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Start date must be before or equal to end date')).toBeInTheDocument()
      })
    })

    it('should validate primary date is within range', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      const startDateInput = screen.getByLabelText('Start Date *')
      const endDateInput = screen.getByLabelText('End Date *')
      const primaryDateInput = screen.getByLabelText('Primary Event Date *')
      
      await user.type(startDateInput, '2025-11-14')
      await user.type(endDateInput, '2025-11-16')
      await user.type(primaryDateInput, '2025-11-17') // Outside range
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Primary event date must be within the start and end date range')).toBeInTheDocument()
      })
    })
  })

  describe('Media Tab', () => {
    it('should render image upload sections', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Media'))
      
      expect(screen.getByText('Main Image *')).toBeInTheDocument()
      expect(screen.getByText('Additional Images (Optional)')).toBeInTheDocument()
      expect(screen.getByText('Choose Image')).toBeInTheDocument()
    })

    it('should handle main image upload', async () => {
      const user = userEvent.setup()
      const mockUpload = vi.fn().mockResolvedValue({
        success: true,
        data: { url: 'test-url', mimeType: 'image/jpeg' }
      })
      
      vi.mocked(require('@/lib/imageUpload').uploadImageToStorage).mockImplementation(mockUpload)
      
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Media'))
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByLabelText('Choose Image')
      
      await user.upload(fileInput, file)
      
      expect(mockUpload).toHaveBeenCalledWith(file, 'main')
    })

    it('should handle gallery image upload', async () => {
      const user = userEvent.setup()
      const mockUpload = vi.fn().mockResolvedValue({
        success: true,
        data: { url: 'test-url', mimeType: 'image/jpeg' }
      })
      
      vi.mocked(require('@/lib/imageUpload').uploadImageToStorage).mockImplementation(mockUpload)
      
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Media'))
      
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const fileInput = screen.getByLabelText('Add Image')
      
      await user.upload(fileInput, file)
      
      expect(mockUpload).toHaveBeenCalledWith(file, 'gallery')
    })
  })

  describe('FAQ Tab', () => {
    it('should render FAQ section with default items', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('FAQ'))
      
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
      expect(screen.getByText('Add FAQ')).toBeInTheDocument()
      
      // Should have default FAQ items
      expect(screen.getByText('FAQ Item 1')).toBeInTheDocument()
      expect(screen.getByText('FAQ Item 2')).toBeInTheDocument()
    })

    it('should add new FAQ item', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('FAQ'))
      await user.click(screen.getByText('Add FAQ'))
      
      expect(screen.getByText('FAQ Item 8')).toBeInTheDocument() // 7 defaults + 1 new
    })

    it('should remove FAQ item', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('FAQ'))
      
      const removeButtons = screen.getAllByRole('button', { name: /trash/i })
      await user.click(removeButtons[0])
      
      expect(screen.queryByText('FAQ Item 1')).not.toBeInTheDocument()
    })

    it('should validate FAQ fields', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('FAQ'))
      
      // Clear a question field
      const questionInput = screen.getByDisplayValue('¿Qué distancias están disponibles?')
      await user.clear(questionInput)
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Question is required')).toBeInTheDocument()
      })
    })
  })

  describe('Tickets Tab', () => {
    it('should render tickets section with default items', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Tickets'))
      
      expect(screen.getByText('Ticket Types')).toBeInTheDocument()
      expect(screen.getByText('Add Ticket Type')).toBeInTheDocument()
      
      // Should have default ticket types
      expect(screen.getByText('Ticket Type 1')).toBeInTheDocument()
      expect(screen.getByText('Ticket Type 2')).toBeInTheDocument()
    })

    it('should add new ticket type', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Tickets'))
      await user.click(screen.getByText('Add Ticket Type'))
      
      expect(screen.getByText('Ticket Type 5')).toBeInTheDocument() // 4 defaults + 1 new
    })

    it('should remove ticket type', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Tickets'))
      
      const removeButtons = screen.getAllByRole('button', { name: /trash/i })
      await user.click(removeButtons[0])
      
      expect(screen.queryByText('Ticket Type 1')).not.toBeInTheDocument()
    })

    it('should validate ticket fields', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Tickets'))
      
      // Clear a ticket name
      const nameInput = screen.getByDisplayValue('Medio Maratón (21 km)')
      await user.clear(nameInput)
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Ticket name is required')).toBeInTheDocument()
      })
    })

    it('should validate ticket price', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Tickets'))
      
      const priceInput = screen.getByDisplayValue('550')
      await user.clear(priceInput)
      await user.type(priceInput, '-10')
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Price must be non-negative')).toBeInTheDocument()
      })
    })
  })

  describe('Order Form Tab', () => {
    it('should render order form section with default fields', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Order Form'))
      
      expect(screen.getByText('Order Form Fields')).toBeInTheDocument()
      expect(screen.getByText('Add Field')).toBeInTheDocument()
      
      // Should have default order form fields
      expect(screen.getByText('Field 1')).toBeInTheDocument()
      expect(screen.getByText('Field 2')).toBeInTheDocument()
    })

    it('should add new order form field', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Order Form'))
      await user.click(screen.getByText('Add Field'))
      
      expect(screen.getByText('Field 9')).toBeInTheDocument() // 8 defaults + 1 new
    })

    it('should remove order form field', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Order Form'))
      
      const removeButtons = screen.getAllByRole('button', { name: /trash/i })
      await user.click(removeButtons[0])
      
      expect(screen.queryByText('Field 1')).not.toBeInTheDocument()
    })

    it('should validate order form fields', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Order Form'))
      
      // Clear a field key
      const keyInput = screen.getByDisplayValue('name')
      await user.clear(keyInput)
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Field key is required')).toBeInTheDocument()
      })
    })
  })

  describe('Confirmation Tab', () => {
    it('should render confirmation section', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Confirmation'))
      
      expect(screen.getByText('Confirmation Page')).toBeInTheDocument()
      expect(screen.getByText('Confirmation Page Message *')).toBeInTheDocument()
    })

    it('should validate plain text only for confirmation message', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Confirmation'))
      
      const messageInput = screen.getByLabelText('Confirmation Page Message *')
      await user.clear(messageInput)
      await user.type(messageInput, 'Hello 😀 <b>bold</b>')
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Text must be plain text only (no emojis, HTML tags, or special characters)')).toBeInTheDocument()
      })
    })
  })

  describe('Email Tab', () => {
    it('should render email section', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Email'))
      
      expect(screen.getByText('Confirmation Email Template')).toBeInTheDocument()
      expect(screen.getByText('From Email *')).toBeInTheDocument()
      expect(screen.getByText('Subject *')).toBeInTheDocument()
      expect(screen.getByText('Email Body (HTML) *')).toBeInTheDocument()
    })

    it('should validate email format', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Email'))
      
      const emailInput = screen.getByLabelText('From Email *')
      await user.clear(emailInput)
      await user.type(emailInput, 'invalid-email')
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText('Invalid email address')).toBeInTheDocument()
      })
    })

    it('should show available template variables', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      await user.click(screen.getByText('Email'))
      
      expect(screen.getByText(/Available variables:/)).toBeInTheDocument()
      expect(screen.getByText(/{{attendee_name}}/)).toBeInTheDocument()
      expect(screen.getByText(/{{event_title}}/)).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup()
      const mockNavigate = vi.fn()
      
      vi.mocked(require('react-router-dom').useNavigate).mockReturnValue(mockNavigate)
      
      render(<EventCreationForm />)
      
      // Fill in required fields
      await user.type(screen.getByLabelText('Event Title *'), 'Test Event')
      await user.type(screen.getByLabelText('Location *'), 'Test Location')
      await user.type(screen.getByLabelText('Short Description *'), 'Test Description')
      await user.type(screen.getByLabelText('Start Date *'), '2025-11-14')
      await user.type(screen.getByLabelText('End Date *'), '2025-11-16')
      await user.type(screen.getByLabelText('Primary Event Date *'), '2025-11-16')
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/events')
      })
    })

    it('should show loading state during submission', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      // Fill in required fields
      await user.type(screen.getByLabelText('Event Title *'), 'Test Event')
      await user.type(screen.getByLabelText('Location *'), 'Test Location')
      await user.type(screen.getByLabelText('Short Description *'), 'Test Description')
      await user.type(screen.getByLabelText('Start Date *'), '2025-11-14')
      await user.type(screen.getByLabelText('End Date *'), '2025-11-16')
      await user.type(screen.getByLabelText('Primary Event Date *'), '2025-11-16')
      
      const submitButton = screen.getByText('Create Event')
      await user.click(submitButton)
      
      expect(screen.getByText('Creating Event...')).toBeInTheDocument()
    })
  })

  describe('Tab Navigation', () => {
    it('should switch between tabs', async () => {
      const user = userEvent.setup()
      render(<EventCreationForm />)
      
      // Start on Event Basics
      expect(screen.getByText('Event Information')).toBeInTheDocument()
      
      // Switch to Media
      await user.click(screen.getByText('Media'))
      expect(screen.getByText('Event Images')).toBeInTheDocument()
      
      // Switch to FAQ
      await user.click(screen.getByText('FAQ'))
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument()
      
      // Switch to Tickets
      await user.click(screen.getByText('Tickets'))
      expect(screen.getByText('Ticket Types')).toBeInTheDocument()
      
      // Switch to Order Form
      await user.click(screen.getByText('Order Form'))
      expect(screen.getByText('Order Form Fields')).toBeInTheDocument()
      
      // Switch to Confirmation
      await user.click(screen.getByText('Confirmation'))
      expect(screen.getByText('Confirmation Page')).toBeInTheDocument()
      
      // Switch to Email
      await user.click(screen.getByText('Email'))
      expect(screen.getByText('Confirmation Email Template')).toBeInTheDocument()
    })
  })
})
