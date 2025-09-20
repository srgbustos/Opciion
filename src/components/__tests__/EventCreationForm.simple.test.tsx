import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/test-utils'
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

describe('EventCreationForm - Basic Tests', () => {
  it('should render sign-in prompt when user is not authenticated', () => {
    render(<EventCreationForm />)
    
    // Check if the sign-in prompt is shown
    expect(screen.getByText('Ready to Create Your Event?')).toBeInTheDocument()
    expect(screen.getByText('Sign In to Create Event')).toBeInTheDocument()
  })

  it('should render the component without crashing', () => {
    render(<EventCreationForm />)
    
    // The component should render without throwing errors
    expect(screen.getByRole('button', { name: /sign in to create event/i })).toBeInTheDocument()
  })

  it('should have proper structure', () => {
    render(<EventCreationForm />)
    
    // Check if the main section is present
    const section = screen.getByRole('heading', { name: /ready to create your event/i })
    expect(section).toBeInTheDocument()
  })
})
