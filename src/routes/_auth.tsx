import { createFileRoute } from '@tanstack/react-router'
import { Outlet, redirect } from '@tanstack/react-router'

import { Card } from '#/components/ui/card'
import { MainNav } from '#/components/MainNav'

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
  const navItems = [
    { to: '/', label: '< Home' },
    // { to: '/dashboard', label: 'Dashboard', exact: true },
    { to: '/gallery', label: 'Gallery' },
    { to: '/logout', label: 'Logout' },
  ]

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 py-12">
      <Card className="w-full">
        <MainNav items={navItems} className="mb-5 ml-2" />
        <Outlet />
      </Card>
    </div>
  )
}
