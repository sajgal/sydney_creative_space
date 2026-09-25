import { describe, it, vi, expect } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { getPublishedGalleries } from '#/firebase/gallery'

vi.mock('#/firebase/gallery', () => ({ getPublishedGalleries: vi.fn() }))
vi.mock('#/auth', async () => ({ useAuth: vi.fn() }))

import { Route } from '../../routes/index'
const HomeComponent = Route.options.component!

vi.mock('#/components/ui/separator', () => ({ Separator: () => <hr /> }))
vi.mock('#/components/Header', () => ({
  Header: () => <header>Header</header>,
}))
vi.mock('#/components/FullWidthSpinner', () => ({
  default: () => <div data-testid="spinner" />,
}))
vi.mock('#/components/Error', () => ({
  Error: ({ message }: { message: string }) => (
    <div role="alert">{message}</div>
  ),
}))
vi.mock('#/components/EmptyCard', () => ({
  EmptyCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="empty-card">{children}</div>
  ),
}))
vi.mock('#/components/GalleryLinks', () => ({
  GalleryLinks: ({ galleries }: { galleries: unknown[] }) => (
    <div data-testid="gallery-links">{galleries.length} galleries</div>
  ),
}))

const renderWithProviders = async () => {
  const rootRoute = createRootRoute()
  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomeComponent,
  })

  const router = createRouter({
    routeTree: rootRoute.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })

  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

  return render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe('HomeComponent', () => {
  it('shows a spinner while loading', async () => {
    // never resolves
    vi.mocked(getPublishedGalleries).mockReturnValue(new Promise(() => {}))

    const screen = await renderWithProviders()

    expect(await screen.findByTestId('spinner')).toBeInTheDocument()
  })

  it('shows an error message when the query fails', async () => {
    vi.mocked(getPublishedGalleries).mockRejectedValue(
      new Error('Network down'),
    )

    const screen = await renderWithProviders()

    expect(await screen.findByRole('alert')).toHaveTextContent('Network down')
  })

  it('shows the empty state when no galleries are published', async () => {
    vi.mocked(getPublishedGalleries).mockResolvedValue([])

    const screen = await renderWithProviders()

    expect(await screen.findByTestId('empty-card')).toBeInTheDocument()
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument()
  })

  it('renders gallery links when data is returned', async () => {
    vi.mocked(getPublishedGalleries).mockResolvedValue([
      { id: '1', userId: 'user1' },
      { id: '2', userId: 'user1' },
    ])

    const screen = await renderWithProviders()

    await waitFor(async () =>
      expect(await screen.findByTestId('gallery-links')).toHaveTextContent(
        '2 galleries',
      ),
    )
    expect(screen.queryByTestId('empty-card')).not.toBeInTheDocument()
  })
})
