import { createFileRoute } from '@tanstack/react-router'
import { Link, Outlet, redirect, useRouter } from '@tanstack/react-router'

import { useAuth } from '#/auth'
import { Card } from '#/components/ui/card'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    // Check if user is authenticated
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const auth = useAuth()

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      auth.logout().then(() => {
        router.invalidate().finally(() => {
          navigate({ to: '/' })
        })
      })
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 py-12">
      <ul className="flex gap-2 py-2">
        <li>
          <Link
            to="/"
            className="hover:underline data-[status='active']:font-semibold"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/dashboard"
            className="hover:underline data-[status='active']:font-semibold"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/gallery"
            className="hover:underline data-[status='active']:font-semibold"
          >
            Gallery
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="hover:underline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </ul>
      <hr />
      <Card className="w-full">
        <Outlet />
      </Card>
    </div>
  )
}
