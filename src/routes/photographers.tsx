import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/photographers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/photographers"!</div>
}
