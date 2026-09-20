import { createFileRoute } from '@tanstack/react-router'
import { Separator } from '#/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { getPublishedGalleries } from '#/firebase/gallery'
import { Error } from '#/components/Error'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import { SubHeader } from '#/components/SubHeader'
import { getUserData } from '#/firebase/user'
import { GalleryLinks } from '#/components/GalleryLinks'
import { Item, ItemContent } from '#/components/ui/item'
import { Markdown } from '@tanstack/markdown/react'

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
      const photographer = await getUserData(authorIdOrName)

      return {
        galleries,
        photographer,
      }
    },
  })

  const isEmpty = !isPending && data && data.galleries?.length === 0
  const photographer = data?.photographer

  if (error) {
    return <Error message={error.message} />
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      {!isPending && (
        <>
          <SubHeader title={photographer?.displayName || 'Anonymous'} />
          <Separator className="my-4" />
        </>
      )}

      <section className="mt-2 mb-6 flex flex-col gap-4">
        {!!isPending && <FullWidthSpinner />}

        {!!photographer && (
          <>
            <Item className="flex flex-col items-center bg-white sm:flex-row sm:items-start">
              <img
                src={photographer.avatar?.secure_url}
                alt={photographer.displayName + '`s avatar'}
                className="aspect-video object-cover sm:aspect-square sm:max-w-40"
              />
              <ItemContent>
                <div className="typeset">
                  <Markdown>{photographer.bio || ''}</Markdown>
                </div>
              </ItemContent>
            </Item>
            <Separator className="my-1" />
          </>
        )}

        {!!isEmpty && <div>Empty :( </div>}

        {!!data && data.galleries.length > 0 && (
          <div className="flex flex-col items-center gap-4 md:items-start">
            <h2 className="text-muted-foreground">Galleries</h2>
            <GalleryLinks galleries={data.galleries || []} />
          </div>
        )}
      </section>
    </div>
  )
}
