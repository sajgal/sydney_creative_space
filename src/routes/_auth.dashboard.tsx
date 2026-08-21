import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useRouteContext()

  return (
    <section className="grid gap-2 p-2">
      <p>Hi {user?.email || 'there'}!</p>
      <p>You are currently on the dashboard route.</p>
    </section>
  )
}
