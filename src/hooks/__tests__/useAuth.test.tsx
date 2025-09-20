import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'

// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn()
  }
}

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient
}))

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with no user and loading false', () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should handle successful sign in', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: { display_name: 'Test User' }
    }

    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: { user: mockUser }, error: null })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signIn('test@example.com', 'password123')
    })

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    })
  })

  it('should handle sign in error', async () => {
    const mockError = { message: 'Invalid credentials' }

    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({ data: { user: null }, error: mockError })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signIn('test@example.com', 'wrongpassword')
    })

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrongpassword'
    })
  })

  it('should handle successful sign up', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'newuser@example.com',
      user_metadata: { display_name: 'New User' }
    }

    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mockSupabaseClient.auth.signUp.mockResolvedValue({ data: { user: mockUser }, error: null })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signUp('newuser@example.com', 'password123', 'New User')
    })

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: 'newuser@example.com',
      password: 'password123',
      options: {
        data: {
          display_name: 'New User'
        }
      }
    })
  })

  it('should handle sign up error', async () => {
    const mockError = { message: 'Email already registered' }

    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mockSupabaseClient.auth.signUp.mockResolvedValue({ data: { user: null }, error: mockError })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signUp('existing@example.com', 'password123', 'Existing User')
    })

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: 'existing@example.com',
      password: 'password123',
      options: {
        data: {
          display_name: 'Existing User'
        }
      }
    })
  })

  it('should handle sign out', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mockSupabaseClient.auth.signOut.mockResolvedValue({ error: null })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
  })

  it('should handle sign out error', async () => {
    const mockError = { message: 'Sign out failed' }

    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mockSupabaseClient.auth.signOut.mockResolvedValue({ error: mockError })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.signOut()
    })

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
  })

  it('should set loading state during sign in', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    
    // Create a promise that we can control
    let resolveSignIn: (value: any) => void
    const signInPromise = new Promise((resolve) => {
      resolveSignIn = resolve
    })
    mockSupabaseClient.auth.signInWithPassword.mockReturnValue(signInPromise)

    const { result } = renderHook(() => useAuth())

    // Start sign in
    act(() => {
      result.current.signIn('test@example.com', 'password123')
    })

    // Check loading state
    expect(result.current.loading).toBe(true)

    // Resolve the promise
    await act(async () => {
      resolveSignIn({ data: { user: null }, error: null })
    })

    expect(result.current.loading).toBe(false)
  })

  it('should set loading state during sign up', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({ data: { user: null } })
    mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    
    // Create a promise that we can control
    let resolveSignUp: (value: any) => void
    const signUpPromise = new Promise((resolve) => {
      resolveSignUp = resolve
    })
    mockSupabaseClient.auth.signUp.mockReturnValue(signUpPromise)

    const { result } = renderHook(() => useAuth())

    // Start sign up
    act(() => {
      result.current.signUp('test@example.com', 'password123', 'Test User')
    })

    // Check loading state
    expect(result.current.loading).toBe(true)

    // Resolve the promise
    await act(async () => {
      resolveSignUp({ data: { user: null }, error: null })
    })

    expect(result.current.loading).toBe(false)
  })
})
