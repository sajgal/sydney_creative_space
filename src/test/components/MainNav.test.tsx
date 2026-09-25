import { describe, it, vi, beforeEach, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useMatchRoute } from '@tanstack/react-router'
import { useAuth } from '#/auth'
import { MainNav } from '#/components/MainNav'

vi.mock('@tanstack/react-router', () => ({
  useMatchRoute: vi.fn(),
  Link: ({ to, children, className, ...rest }: any) => (
    <a href={to} className={className} {...rest}>
      {children}
    </a>
  ),
}))

vi.mock('#/auth', () => ({ useAuth: vi.fn() }))

vi.mock('lucide-react', () => ({
  FingerprintPattern: () => <svg data-testid="icon-fingerprint" />,
  ShieldKeyhole: () => <svg data-testid="icon-shield" />,
}))

const items = [
  { to: '/', label: 'Home', exact: true },
  { to: '/gallery', label: 'Gallery' },
]

const authDefaults = { isAuthenticated: false, isSuperAdmin: false }

describe('MainNav', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(authDefaults as any)
    vi.mocked(useMatchRoute).mockReturnValue(() => false)
  })

  it('renders all nav items with their labels', () => {
    render(<MainNav items={items} />)

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Gallery')).toBeInTheDocument()
  })

  it('applies active styling to the item that matches the current route', () => {
    vi.mocked(useMatchRoute).mockReturnValue(
      (({ to }: { to: string }) => to === '/gallery') as any, // it's not worth it to type this properly
    )

    render(<MainNav items={items} />)

    expect(screen.getByText('Gallery')).toHaveClass('bg-accent')
    expect(screen.getByText('Home')).not.toHaveClass('bg-accent')
  })

  it('passes fuzzy=true for non-exact items and fuzzy=false for exact items', () => {
    const matchRouteSpy = vi.fn().mockReturnValue(false)
    vi.mocked(useMatchRoute).mockReturnValue(matchRouteSpy)

    render(<MainNav items={items} />)

    expect(matchRouteSpy).toHaveBeenCalledWith({ to: '/', fuzzy: false })
    expect(matchRouteSpy).toHaveBeenCalledWith({ to: '/gallery', fuzzy: true })
  })

  it('does not show the management or admin icons for a regular unauthenticated user', () => {
    render(<MainNav items={items} />)

    expect(screen.queryByTestId('icon-fingerprint')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Admin')).not.toBeInTheDocument()
  })

  it('shows the admin shield link when authenticated and not already on an admin page', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authDefaults,
      isAuthenticated: true,
    } as any)

    render(<MainNav items={items} isAdmin={false} />)

    expect(screen.getByLabelText('Admin')).toBeInTheDocument()
    expect(screen.getByTestId('icon-shield')).toBeInTheDocument()
  })

  it('hides the admin shield link when isAdmin is true, even if authenticated', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authDefaults,
      isAuthenticated: true,
    } as any)

    render(<MainNav items={items} isAdmin />)

    expect(screen.queryByLabelText('Admin')).not.toBeInTheDocument()
  })

  it('hides the admin shield link when not authenticated', () => {
    render(<MainNav items={items} isAdmin={false} />)

    expect(screen.queryByLabelText('Admin')).not.toBeInTheDocument()
  })

  it('shows the management fingerprint link only for a super admin on an admin page', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authDefaults,
      isSuperAdmin: true,
    } as any)

    render(<MainNav items={items} isAdmin />)

    expect(screen.getByTestId('icon-fingerprint')).toBeInTheDocument()
  })

  it('hides the management link for a super admin when not on an admin page', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...authDefaults,
      isSuperAdmin: true,
    } as any)

    render(<MainNav items={items} isAdmin={false} />)

    expect(screen.queryByTestId('icon-fingerprint')).not.toBeInTheDocument()
  })

  it('hides the management link for isAdmin=true when user is not a super admin', () => {
    render(<MainNav items={items} isAdmin />)

    expect(screen.queryByTestId('icon-fingerprint')).not.toBeInTheDocument()
  })
})
