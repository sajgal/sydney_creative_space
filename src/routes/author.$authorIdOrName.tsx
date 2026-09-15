import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '#/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { getPublishedGalleries } from '#/firebase/gallery'
import { Error } from '#/components/Error'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import { SubHeader } from '#/components/SubHeader'
import { getUserData } from '#/firebase/user'
import { GalleryLinksOld } from '#/components/GalleryLinksOld'

export const Route = createFileRoute('/author/$authorIdOrName')({
  component: AuthorComponent,
  head: () => ({
    meta: [
      {
        title: 'Author page',
      },
    ],
  }),
})

function AuthorComponent() {
  const { authorIdOrName } = Route.useParams()

  const { isPending, error, data } = useQuery({
    queryKey: ['authorPage', authorIdOrName],
    queryFn: async () => {
      const galleries = await getPublishedGalleries(authorIdOrName)
      const author = await getUserData(authorIdOrName)

      return {
        galleries,
        author,
      }
    },
  })

  const isEmpty = !isPending && data && data.galleries?.length === 0

  if (error) {
    return <Error message={error.message} />
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      {!isPending && (
        <>
          <SubHeader title={data?.author?.displayName || 'Anonymous'} />
          <Separator className="my-4" />
        </>
      )}

      <section className="mt-2 mb-6 flex flex-col gap-4">
        {!!isPending && <FullWidthSpinner />}

        {!!isEmpty && <div>Empty :( </div>}

        {!!data && data.galleries.length > 0 && (
          <GalleryLinksOld galleries={data.galleries} />
        )}
      </section>
    </div>
  )
}
