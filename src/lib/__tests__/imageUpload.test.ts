import { describe, it, expect, vi, beforeEach } from 'vitest'
import { 
  validateImageFile, 
  getImageDimensions, 
  uploadImageToStorage, 
  validateImageDimensions, 
  formatFileSize 
} from '../imageUpload'

// Mock fetch
global.fetch = vi.fn()

// Mock URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mock-object-url')
global.URL.revokeObjectURL = vi.fn()

describe('Image Upload Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('validateImageFile', () => {
    it('should validate valid image file', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })

    it('should reject file that is too large', () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: 11 * 1024 * 1024 }) // 11MB
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('File size must be less than 10MB')
    })

    it('should reject unsupported file type', () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Only JPEG and PNG images are allowed')
    })

    it('should accept PNG files', () => {
      const file = new File(['test'], 'test.png', { type: 'image/png' })
      const result = validateImageFile(file)
      expect(result.valid).toBe(true)
    })
  })

  describe('getImageDimensions', () => {
    it('should return image dimensions', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      // Mock Image constructor
      const mockImage = {
        width: 1920,
        height: 1080,
        onload: null as any,
        onerror: null as any,
        src: ''
      }
      
      vi.stubGlobal('Image', vi.fn(() => mockImage))
      
      const promise = getImageDimensions(file)
      
      // Simulate successful image load
      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload()
        }
      }, 0)
      
      const result = await promise
      expect(result).toEqual({ width: 1920, height: 1080 })
    })

    it('should reject on image load error', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      
      const mockImage = {
        width: 0,
        height: 0,
        onload: null as any,
        onerror: null as any,
        src: ''
      }
      
      vi.stubGlobal('Image', vi.fn(() => mockImage))
      
      const promise = getImageDimensions(file)
      
      // Simulate image load error
      setTimeout(() => {
        if (mockImage.onerror) {
          mockImage.onerror()
        }
      }, 0)
      
      await expect(promise).rejects.toThrow('Failed to load image')
    })
  })

  describe('uploadImageToStorage', () => {
    it('should handle invalid file before upload', async () => {
      const file = new File(['test'], 'test.gif', { type: 'image/gif' })
      
      const result = await uploadImageToStorage(file)
      
      expect(result.success).toBe(false)
      expect(result.error).toBe('Only JPEG and PNG images are allowed')
    })
  })

  describe('validateImageDimensions', () => {
    it('should validate recommended dimensions', () => {
      const result = validateImageDimensions(2160, 1080)
      expect(result.valid).toBe(true)
      expect(result.warning).toBeUndefined()
    })

    it('should warn about smaller dimensions', () => {
      const result = validateImageDimensions(1920, 1080)
      expect(result.valid).toBe(true)
      expect(result.warning).toBe('Recommended dimensions are 2160×1080px. Your image is 1920×1080px.')
    })

    it('should warn about much smaller dimensions', () => {
      const result = validateImageDimensions(800, 600)
      expect(result.valid).toBe(true)
      expect(result.warning).toBe('Recommended dimensions are 2160×1080px. Your image is 800×600px.')
    })
  })

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes')
      expect(formatFileSize(1024)).toBe('1 KB')
      expect(formatFileSize(1024 * 1024)).toBe('1 MB')
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB')
    })

    it('should format decimal sizes correctly', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB') // 1.5 KB
      expect(formatFileSize(1536 * 1024)).toBe('1.5 MB') // 1.5 MB
    })

    it('should handle large files', () => {
      expect(formatFileSize(5 * 1024 * 1024 * 1024)).toBe('5 GB')
    })
  })
})
