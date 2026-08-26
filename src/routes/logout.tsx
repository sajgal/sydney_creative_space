import { useAuth } from '#/auth'
import { Spinner } from '#/components/ui/spinner'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/logout')({
  component: LogoutComponent,
})

function LogoutComponent() {
  const router = useRouter()
  const navigate = Route.useNavigate()
  const auth = useAuth()

  auth.logout().then(() => {
    router.invalidate().finally(() => {
      navigate({ to: '/' })
    })
  })

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner />
    </div>
  )
}
