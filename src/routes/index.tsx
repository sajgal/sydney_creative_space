import { createFileRoute } from '@tanstack/react-router'
import { redirect } from '@tanstack/react-router'

import { ModeToggle } from '@/components/mode-toggle'

import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    // Log for debugging
    console.log('Checking context on index.tsx:', context) // Check if user is authenticated
    // if (context.auth.isAuthenticated) {
    //   console.log('User authenticated, proceeding...')
    //   throw redirect({
    //     to: '/dashboard',
    //   })
    // }
  },
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <section className="mb-6 flex items-center justify-between">
        <h1 className="mb-4 text-2xl font-bold">
          Matej's
          <br />
          Zines
          <br />
        </h1>

        <ModeToggle />
      </section>

      <Separator />

      <section className="mt-2 mb-6 p-4">
        <div className="text-center text-2xl">Zines here</div>
        <div className="text-center text-2xl">soon</div>
      </section>
    </div>
  )
}
