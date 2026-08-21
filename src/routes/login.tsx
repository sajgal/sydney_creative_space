import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { Login } from '~/components/Login'

const loginSearchSchema = z.object({
  redirect: z.string().default(''),
})

export const Route = createFileRoute('/login')({
  component: LoginComponent,
  validateSearch: loginSearchSchema,
})

function LoginComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Login />
    </div>
  )
}
