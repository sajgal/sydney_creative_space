import { createFileRoute, Link } from '@tanstack/react-router'

import { Separator } from '#/components/ui/separator'
import { useQuery } from '@tanstack/react-query'
import { getGalleryById } from '#/firebase/gallery'
import { Error } from '#/components/Error'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import type { Gallery as GalleryType, GalleryPhoto } from '#/types/gallery'
import { Gallery } from '#/components/Gallery'

export const Route = createFileRoute('/show/$galleryId')({
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

  const { isPending, error, data } = useQuery({
    queryKey: ['showGallery', galleryId],
    queryFn: async () => getGalleryById(galleryId),
  })

  const isEmpty = !isPending && data && data?.length === 0

  if (error) {
    return <Error message={error.message} />
  }

  if (isPending) {
    return <FullWidthSpinner />
  }

  if (isEmpty) {
    return <div>Empty. </div>
  }

  const gallery = data as GalleryType

  return (
    <div className="mx-auto max-w-3xl p-4">
      <section className="mb-6 flex items-center justify-between">
        <Link to="/">
          <h1 className="mb-4 text-2xl font-bold">Back</h1>
        </Link>
      </section>

      <Separator />

      <section className="mt-2 mb-6 flex flex-col gap-4">
        <h1>{gallery.title}</h1>
        <div>{gallery.description}</div>

        {gallery?.photos && (
          <Gallery className="mt-4 grid grid-cols-3 gap-2">
            {gallery.photos.map((photo: GalleryPhoto, index: number) => (
              <PhotoWrapper
                key={index}
                className="flex cursor-pointer flex-col"
                photo={photo}
              >
                <img src={photo.thumbnail_url} className="h-36 object-cover" />
              </PhotoWrapper>
            ))}
          </Gallery>
        )}
      </section>
    </div>
  )
}
