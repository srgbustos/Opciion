import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

// Mock Supabase client
const mockSupabaseClient = {
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }))
}

// Mock the Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabaseClient
}))

// Mock useAuth hook
const mockUseAuth = {
  user: null,
  loading: false,
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn()
}

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth
}))

// Mock useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}))

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: 'test-id' })
  }
})

// Mock @tanstack/react-query
vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    QueryClient: vi.fn().mockImplementation((options) => ({
      defaultOptions: options?.defaultOptions || {},
      getQueryData: vi.fn(),
      setQueryData: vi.fn(),
      invalidateQueries: vi.fn(),
      refetchQueries: vi.fn(),
      cancelQueries: vi.fn(),
      removeQueries: vi.fn(),
      clear: vi.fn(),
      mount: vi.fn(),
      unmount: vi.fn(),
      getQueryCache: vi.fn(),
      getMutationCache: vi.fn(),
      isFetching: vi.fn(),
      isMutating: vi.fn(),
      getDefaultOptions: vi.fn(),
      setDefaultOptions: vi.fn(),
      setQueryDefaults: vi.fn(),
      setMutationDefaults: vi.fn(),
      getQueryDefaults: vi.fn(),
      getMutationDefaults: vi.fn(),
      getLogger: vi.fn(),
      setLogger: vi.fn(),
    }))
  }
})

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
