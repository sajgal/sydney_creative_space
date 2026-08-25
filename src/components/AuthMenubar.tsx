import { Link } from '@tanstack/react-router'

export function AuthMenubar({ handleLogout }: { handleLogout: () => void }) {
  return (
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
  )
}
