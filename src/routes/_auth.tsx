import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      // throw new Error('Not authenticated')
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
  return (
    <div className="h-full p-2">
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
          <Link
            to="/logout"
            className="hover:underline data-[status='active']:font-semibold"
          >
            Logout
          </Link>
        </li>
      </ul>
      <hr />
      <Outlet />
    </div>
  )
}
