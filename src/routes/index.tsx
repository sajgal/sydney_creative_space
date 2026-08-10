import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'

import { ModeToggle } from '@/components/mode-toggle'

import { Separator } from '@/components/ui/separator'
import { GithubLogin } from '@/components/github-login'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    // Log for debugging
    console.log('Checking context on index.tsx:', context) // Check if user is authenticated
    if (context.auth.isAuthenticated) {
      console.log('User authenticated, proceeding...')
      throw redirect({
        to: '/dashboard',
      })
    }
  },
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <section className='mb-6 flex justify-between items-center'>
        <h1 className="text-2xl font-bold mb-4">
          Focus<br />
          Tracking<br />
          Board<br />
        </h1>

        <ModeToggle />
      </section>

      <Separator />

      <section className="mb-6 mt-2 p-4">
        <div className='text-2xl text-center'>
          This is for you if you like tracking your progress. <br />
          <small>Screenshots will be added soon.</small>
        </div>
      </section>

      <Separator />

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-center">You should probably log in first</h2>

        <div className='flex justify-center'>
          <GithubLogin />
        </div>
      </section>
    </div>
  )
}
