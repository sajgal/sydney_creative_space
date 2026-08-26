import { z } from 'zod'
import { redirect } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { EmailLogin } from '#/components/EmailLogin'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
const fallback = '/gallery' as const

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
    <div className="flex min-h-screen items-center justify-center">
      <EmailLogin />
      {/* <GithubLogin /> //disabled for now */}
    </div>
  )
}
