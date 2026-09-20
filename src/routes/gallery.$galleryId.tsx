import { createFileRoute, notFound } from '@tanstack/react-router'
import { Separator } from '#/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { getGalleryById } from '#/firebase/gallery'
import { Error } from '#/components/Error'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import type { Gallery as GalleryType, GalleryPhoto } from '#/types/gallery'
import { Gallery } from '#/components/Gallery'
import { SubHeader } from '#/components/SubHeader'
import { Markdown } from '@tanstack/markdown/react'
import { useAuth } from '#/auth'

export const Route = createFileRoute('/gallery/$galleryId')({
  component: ShowGalleryComponent,
})

function PhotoWrapper({
  children,
  photo,
  ...props
}: React.ComponentProps<'div'> & {
  children: React.ReactNode
  photo: GalleryPhoto
}) {
  return <div {...props}>{children}</div>
}

function ShowGalleryComponent() {
  const { galleryId } = Route.useParams()
  const { isAuthenticated } = useAuth()

  const { isPending, error, data } = useQuery({
    queryKey: ['showGallery', galleryId],
    queryFn: async () => getGalleryById(galleryId),
  })

  const isAccessible = data?.isApproved || isAuthenticated

  if (!isAccessible) {
    throw notFound()
  }

  const isEmpty = !isPending && data?.id

  if (error) {
    return <Error message={error.message} />
  }

  if (isPending) {
    return <FullWidthSpinner fullHeight={true} />
  }

  if (isEmpty) {
    return <div>Empty. </div>
  }

  const gallery = data as GalleryType

  return (
    <div className="mx-auto max-w-3xl p-4">
      <SubHeader
        title={gallery.title || '-'}
        author={gallery.userData?.displayName || 'Anonyous'}
      />

      <Separator className="my-4" />

      <section className="mt-2 mb-6 flex flex-col gap-4">
        <div className="typeset">
          <Markdown>{gallery.description || ''}</Markdown>
        </div>

        {gallery?.photos && (
          <Gallery className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {gallery.photos.map((photo: GalleryPhoto, index: number) => (
              <PhotoWrapper
                key={index}
                className="flex cursor-pointer flex-col overflow-hidden"
                photo={photo}
              >
                <img
                  src={photo.thumbnail_url}
                  className="aspect-square object-cover transition-transform duration-200 hover:scale-110 hover:shadow-md"
                />
              </PhotoWrapper>
            ))}
          </Gallery>
        )}
      </section>
    </div>
  )
}
