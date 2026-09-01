import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

import { CloudinaryUploadWidget } from '#/components/CloudinaryUploadWidget'
import {
  addPhotoToGallery,
  getGalleryById,
  removePhotoFromGallery,
} from '#/firebase/gallery'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import { useAuth } from '#/auth'
import { Error } from '#/components/Error'
import { destroyImage } from '#/cloudinary/cloudinary-server-functions'
import { useState } from 'react'
import { GalleryStatus } from '#/components/GalleryStatus'
import { getServerTime } from '#/utils/server-functions'
import { Button } from '#/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { deleteAllGalleryPhotos } from '#/utils/handleDelete'
import { Spinner } from '#/components/ui/spinner'
import { GalleryDetailsForm } from '#/components/GalleryDetailsForm'

export type GalleryPhoto = {
  secure_url: string
  thumbnail_url: string
  public_id: string
}

export const Route = createFileRoute('/_auth/gallery/$galleryId')({
  component: RouteComponent,
  loader: () => getServerTime(),
})

function RouteComponent() {
  const router = useRouter()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { galleryId } = Route.useParams()
  const serverTime = Route.useLoaderData()
  const queryKey = ['galleryData', galleryId]
  const [pendingDeleteImageId, setPendingDeleteImageId] = useState('')
  const [isPendingBatchImageDeletion, setIsPendingBatchImageDeletion] =
    useState(false)

  const invalidateRouteData = async () => {
    await queryClient.refetchQueries({ queryKey })
    await router.invalidate()
  }

  const { isPending, error, data } = useQuery({
    queryKey,
    queryFn: async () => getGalleryById(user?.uid || '-', galleryId),
  })

  const handleImageDelete = async (photo: GalleryPhoto) => {
    setPendingDeleteImageId(photo.public_id)

    const { error, response } = await destroyImage({ data: { photo } })

    if (error) {
      console.error(response)
      return setPendingDeleteImageId('')
    }

    await removePhotoFromGallery(galleryId, photo)
    await invalidateRouteData()
    setPendingDeleteImageId('')
  }

  const handleDeleteAll = async (galleryId: string) => {
    setIsPendingBatchImageDeletion(true)

    try {
      await deleteAllGalleryPhotos(galleryId)
    } catch (error) {
      console.error('Error while deleting images from gallery', error)
    }

    await invalidateRouteData()
    setIsPendingBatchImageDeletion(false)
  }

  if (error) return <Error message={error.message} fullHeight={false} />

  const isEmpty = !data?.photos?.length

  return (
    <section className="p-2 pt-0">
      {!!isPending && <FullWidthSpinner />}

      {!!data && (
        <>
          <div className="flex max-w-full items-end justify-between gap-2">
            <Link to="/gallery">
              <Button variant="outline">
                <ChevronLeft data-icon="inline-start" /> Back
              </Button>
            </Link>
            <GalleryStatus
              publishedAt={data?.publishedAt}
              serverTime={serverTime}
              galleryId={galleryId}
              invalidateRouteData={invalidateRouteData}
            />
            <CloudinaryUploadWidget
              galleryId={galleryId}
              onUpload={[addPhotoToGallery, invalidateRouteData]}
            />
          </div>
          <div className="mt-4 flex max-w-full flex-col">
            <Button
              disabled={isPendingBatchImageDeletion || isEmpty}
              onClick={() => handleDeleteAll(galleryId)}
            >
              {!!isPendingBatchImageDeletion ? (
                <Spinner data-icon="inline-start" />
              ) : (
                'Delete all photos'
              )}
            </Button>
            <div className="flex flex-col gap-2">
              <GalleryDetailsForm galleryData={{...data, galleryId}} onSave={invalidateRouteData} />

              {isEmpty && <div>No photos yet.</div>}

              <div className="flex gap-2">
                {!!data?.photos?.length &&
                  data.photos.map((photo: GalleryPhoto, key: number) => {
                    if (pendingDeleteImageId === photo.public_id) {
                      return <Spinner key={key} className="size-14" />
                    }

                    return (
                      <div key={key}>
                        <img src={photo.thumbnail_url} />
                        <button onClick={() => handleImageDelete(photo)}>
                          Delete
                        </button>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
