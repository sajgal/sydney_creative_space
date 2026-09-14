import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '#/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { getPublishedGalleries } from '#/firebase/gallery'
import { Error } from '#/components/Error'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import { GalleryLinks } from '#/components/GalleryLinks'
import { Header } from '#/components/Header'
import { getServerTime } from '#/utils/server-functions'

export const Route = createFileRoute('/')({
  component: HomeComponent,
  loader: () => getServerTime(),
})

function HomeComponent() {
  const serverTime = Route.useLoaderData()

  const { isPending, error, data } = useQuery({
    queryKey: ['homepagee'],
    queryFn: async () => getPublishedGalleries(),
  })

  const isEmpty = !isPending && data && data?.length === 0

  if (error) {
    return <Error message={error.message} />
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Header serverTime={serverTime} />

      <Separator className="m-4" />

      <section className="mt-2 mb-6 flex flex-col gap-4">
        {!!isPending && <FullWidthSpinner />}

        {!!isEmpty && <div>Empty :( </div>}

        <GalleryLinks galleries={data || []} />
      </section>
    </div>
  )
}
