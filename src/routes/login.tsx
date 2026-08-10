import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { GithubLogin } from '@/components/github-login'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = '/dashboard' as const

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback })
    }
  },
  component: LoginComponent,
})

function LoginComponent() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <GithubLogin />
    </div>
  )
}
