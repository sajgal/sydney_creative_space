import { createFileRoute } from '@tanstack/react-router'

import { Separator } from '#/components/ui/separator'
import { getServerTime } from '#/server-functions'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: () => getServerTime(),
})

function HomeComponent() {
  const data = Route.useLoaderData()

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
      </section>

      <Separator />

      <section className="mt-2 mb-6 p-4">
        <div className="text-center text-2xl">Images comming</div>
        <div className="text-center text-2xl">soon</div>
        <div>Server time {data}</div>
      </section>
    </div>
  )
}
