import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldKeyhole } from 'lucide-react'

import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <section className="mb-6 flex items-center justify-between">
        <h1 className="mb-4 text-2xl font-bold">
          Sydney
          <br />
          Creative
          <br />
          .space
        </h1>

        <Link to="/gallery">
          <Button size="icon-lg" aria-label="Admin" variant="outline">
            <ShieldKeyhole />
          </Button>
        </Link>
      </section>

      <Separator />

      <section className="mt-2 mb-6 p-4">
        <div className="text-center text-2xl">Images comming</div>
        <div className="text-center text-2xl">soon</div>
      </section>
    </div>
  )
}
