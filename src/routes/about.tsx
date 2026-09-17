import { Header } from '#/components/Header'
import { Separator } from '#/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <Header />

      <Separator className="my-4" />

      <section className="mt-2 mb-6 flex flex-col items-center gap-4">
        <div className="max-w-sm">
          I made this for my friends.
          <div className="text-right">- Matej</div>
        </div>
      </section>
    </div>
  )
}
