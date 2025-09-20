import { describe, it, expect } from 'vitest'
import { eventCreationSchema, imageUploadSchema } from '../eventValidation'

describe('Event Validation Schema', () => {
  describe('eventCreationSchema', () => {
    const validEventData = {
      title: 'Test Event',
      shortDescription: 'A test event description',
      overview: 'Detailed overview of the test event',
      location: 'Test Location',
      startDate: '2025-11-14',
      endDate: '2025-11-16',
      primaryEventDate: '2025-11-16',
      images: {
        main: {
          url: 'https://example.com/image.jpg',
          mimeType: 'image/jpeg' as const
        },
        gallery: []
      },
      faq: [
        {
          question: 'Test question?',
          answer: 'Test answer'
        }
      ],
      tickets: [
        {
          name: 'Test Ticket',
          price: 100,
          quantityPerOrder: 1,
          description: 'Test ticket description',
          active: true
        }
      ],
      orderForm: [
        {
          key: 'name',
          type: 'string' as const,
          required: true,
          label: 'Name'
        }
      ],
      specialInstructions: ['Test instruction'],
      confirmationPageMessage: 'Registration confirmed!',
      confirmationEmail: {
        from: 'test@example.com',
        subject: 'Test Subject',
        htmlBody: '<p>Test email body</p>'
      }
    }

    it('should validate valid event data', () => {
      const result = eventCreationSchema.safeParse(validEventData)
      expect(result.success).toBe(true)
    })

    describe('title validation', () => {
      it('should require title', () => {
        const data = { ...validEventData, title: '' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Event title is required')
        }
      })

      it('should limit title length to 120 characters', () => {
        const data = { ...validEventData, title: 'a'.repeat(121) }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Title must be less than 120 characters')
        }
      })
    })

    describe('shortDescription validation', () => {
      it('should require short description', () => {
        const data = { ...validEventData, shortDescription: '' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Short description is required')
        }
      })

      it('should limit short description to 280 characters', () => {
        const data = { ...validEventData, shortDescription: 'a'.repeat(281) }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Short description must be less than 280 characters')
        }
      })
    })

    describe('overview validation', () => {
      it('should require overview', () => {
        const data = { ...validEventData, overview: '' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Overview is required')
        }
      })

      it('should limit overview to 5000 characters', () => {
        const data = { ...validEventData, overview: 'a'.repeat(5001) }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Overview must be less than 5000 characters')
        }
      })
    })

    describe('location validation', () => {
      it('should require location', () => {
        const data = { ...validEventData, location: '' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Location is required')
        }
      })

      it('should limit location to 200 characters', () => {
        const data = { ...validEventData, location: 'a'.repeat(201) }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Location must be less than 200 characters')
        }
      })
    })

    describe('date validation', () => {
      it('should require start date', () => {
        const data = { ...validEventData, startDate: '' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Start date is required')
        }
      })

      it('should require end date', () => {
        const data = { ...validEventData, endDate: '' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('End date is required')
        }
      })

      it('should require primary event date', () => {
        const data = { ...validEventData, primaryEventDate: '' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Primary event date is required')
        }
      })

      it('should validate date format', () => {
        const data = { ...validEventData, startDate: 'invalid-date' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid date format (YYYY-MM-DD)')
        }
      })

      it('should require start date to be before or equal to end date', () => {
        const data = { 
          ...validEventData, 
          startDate: '2025-11-16',
          endDate: '2025-11-14',
          primaryEventDate: '2025-11-15' // Valid primary date to avoid that error
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          // The error could be either start/end date or primary date validation
          const errorMessages = result.error.issues.map(issue => issue.message)
          expect(errorMessages).toContain('Start date must be before or equal to end date')
        }
      })

      it('should require primary date to be within start and end date range', () => {
        const data = { 
          ...validEventData, 
          startDate: '2025-11-14',
          endDate: '2025-11-16',
          primaryEventDate: '2025-11-17'
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Primary event date must be within the start and end date range')
        }
      })
    })

    describe('images validation', () => {
      it('should allow null main image', () => {
        const data = { ...validEventData, images: { main: null, gallery: [] } }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(true)
      })

      it('should limit gallery images to 3', () => {
        const data = { 
          ...validEventData, 
          images: { 
            main: null, 
            gallery: [
              { url: 'https://example.com/1.jpg', mimeType: 'image/jpeg' as const },
              { url: 'https://example.com/2.jpg', mimeType: 'image/jpeg' as const },
              { url: 'https://example.com/3.jpg', mimeType: 'image/jpeg' as const },
              { url: 'https://example.com/4.jpg', mimeType: 'image/jpeg' as const }
            ]
          } 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Maximum 3 additional images allowed')
        }
      })
    })

    describe('FAQ validation', () => {
      it('should require at least one FAQ item', () => {
        const data = { ...validEventData, faq: [] }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('At least one FAQ item is required')
        }
      })

      it('should limit FAQ items to 20', () => {
        const faqItems = Array.from({ length: 21 }, (_, i) => ({
          question: `Question ${i + 1}?`,
          answer: `Answer ${i + 1}`
        }))
        const data = { ...validEventData, faq: faqItems }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Maximum 20 FAQ items allowed')
        }
      })

      it('should validate FAQ question length', () => {
        const data = { 
          ...validEventData, 
          faq: [{ 
            question: 'a'.repeat(201), 
            answer: 'Test answer' 
          }] 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Question must be less than 200 characters')
        }
      })

      it('should validate FAQ answer length', () => {
        const data = { 
          ...validEventData, 
          faq: [{ 
            question: 'Test question?', 
            answer: 'a'.repeat(1001) 
          }] 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Answer must be less than 1000 characters')
        }
      })
    })

    describe('tickets validation', () => {
      it('should require at least one ticket type', () => {
        const data = { ...validEventData, tickets: [] }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('At least one ticket type is required')
        }
      })

      it('should limit ticket types to 10', () => {
        const tickets = Array.from({ length: 11 }, (_, i) => ({
          name: `Ticket ${i + 1}`,
          price: 100,
          quantityPerOrder: 1,
          description: 'Test description',
          active: true
        }))
        const data = { ...validEventData, tickets }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Maximum 10 ticket types allowed')
        }
      })

      it('should validate ticket name length', () => {
        const data = { 
          ...validEventData, 
          tickets: [{ 
            name: 'a'.repeat(101), 
            price: 100, 
            quantityPerOrder: 1, 
            description: 'Test description', 
            active: true 
          }] 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Ticket name must be less than 100 characters')
        }
      })

      it('should validate ticket price is non-negative', () => {
        const data = { 
          ...validEventData, 
          tickets: [{ 
            name: 'Test Ticket', 
            price: -10, 
            quantityPerOrder: 1, 
            description: 'Test description', 
            active: true 
          }] 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Price must be non-negative')
        }
      })

      it('should validate quantity per order is at least 1', () => {
        const data = { 
          ...validEventData, 
          tickets: [{ 
            name: 'Test Ticket', 
            price: 100, 
            quantityPerOrder: 0, 
            description: 'Test description', 
            active: true 
          }] 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Quantity per order must be at least 1')
        }
      })

      it('should validate ticket description length', () => {
        const data = { 
          ...validEventData, 
          tickets: [{ 
            name: 'Test Ticket', 
            price: 100, 
            quantityPerOrder: 1, 
            description: 'a'.repeat(501), 
            active: true 
          }] 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Description must be less than 500 characters')
        }
      })
    })

    describe('orderForm validation', () => {
      it('should require at least one order form field', () => {
        const data = { ...validEventData, orderForm: [] }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('At least one order form field is required')
        }
      })

      it('should validate field key is required', () => {
        const data = { 
          ...validEventData, 
          orderForm: [{ 
            key: '', 
            type: 'string' as const, 
            required: true, 
            label: 'Test Field' 
          }] 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Field key is required')
        }
      })

      it('should validate field label is required', () => {
        const data = { 
          ...validEventData, 
          orderForm: [{ 
            key: 'test', 
            type: 'string' as const, 
            required: true, 
            label: '' 
          }] 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Field label is required')
        }
      })
    })

    describe('confirmationPageMessage validation', () => {
      it('should require confirmation page message', () => {
        const data = { ...validEventData, confirmationPageMessage: '' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Confirmation page message is required')
        }
      })

      it('should limit confirmation message to 500 characters', () => {
        const data = { ...validEventData, confirmationPageMessage: 'a'.repeat(501) }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Message must be less than 500 characters')
        }
      })

      it('should reject emojis in confirmation message', () => {
        const data = { ...validEventData, confirmationPageMessage: 'Hello 😀' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Text must be plain text only (no emojis, HTML tags, or special characters)')
        }
      })

      it('should reject HTML tags in confirmation message', () => {
        const data = { ...validEventData, confirmationPageMessage: 'Hello <b>bold</b>' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Text must be plain text only (no emojis, HTML tags, or special characters)')
        }
      })

      it('should reject special characters in confirmation message', () => {
        const data = { ...validEventData, confirmationPageMessage: 'Hello café' }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Text must be plain text only (no emojis, HTML tags, or special characters)')
        }
      })
    })

    describe('confirmationEmail validation', () => {
      it('should require from email', () => {
        const data = { 
          ...validEventData, 
          confirmationEmail: { 
            ...validEventData.confirmationEmail, 
            from: '' 
          } 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid email address')
        }
      })

      it('should validate email format', () => {
        const data = { 
          ...validEventData, 
          confirmationEmail: { 
            ...validEventData.confirmationEmail, 
            from: 'invalid-email' 
          } 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Invalid email address')
        }
      })

      it('should require subject', () => {
        const data = { 
          ...validEventData, 
          confirmationEmail: { 
            ...validEventData.confirmationEmail, 
            subject: '' 
          } 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Subject is required')
        }
      })

      it('should limit subject to 100 characters', () => {
        const data = { 
          ...validEventData, 
          confirmationEmail: { 
            ...validEventData.confirmationEmail, 
            subject: 'a'.repeat(101) 
          } 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Subject must be less than 100 characters')
        }
      })

      it('should require HTML body', () => {
        const data = { 
          ...validEventData, 
          confirmationEmail: { 
            ...validEventData.confirmationEmail, 
            htmlBody: '' 
          } 
        }
        const result = eventCreationSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          expect(result.error.issues[0].message).toBe('Email body is required')
        }
      })
    })
  })

  describe('imageUploadSchema', () => {
    it('should validate valid image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = imageUploadSchema.safeParse({ file })
      expect(result.success).toBe(true)
    })

    it('should reject file that is too large', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }) // 11MB
      const result = imageUploadSchema.safeParse({ file })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('File size must be less than 10MB')
      }
    })

    it('should reject unsupported file type', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' })
      const result = imageUploadSchema.safeParse({ file })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Only JPEG and PNG images are allowed')
      }
    })

    it('should accept PNG files', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const result = imageUploadSchema.safeParse({ file })
      expect(result.success).toBe(true)
    })
  })
})
