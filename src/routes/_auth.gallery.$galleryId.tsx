import { createFileRoute, Link, useRouter } from '@tanstack/react-router'

import { CloudinaryUploadWidget } from '#/components/CloudinaryUploadWidget'
import { addPhotoToGallery, getUserGalleryById } from '#/firebase/gallery'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import { useAuth } from '#/auth'
import { Error } from '#/components/Error'
import { useState } from 'react'
import { GalleryStatus } from '#/components/GalleryStatus'
import { getServerTime } from '#/utils/server-functions'
import { Button } from '#/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { GalleryDetailsForm } from '#/components/GalleryDetailsForm'
import { AdminPhotoList } from '#/components/AdminPhotoList'
import { Switch } from '#/components/ui/switch'
import { Label } from '#/components/ui/label'
import { DeleteAllImagesButton } from '#/components/DeleteAllImagesButton'
import { EmptyGalleryCard } from '#/components/EmptyGalleryCard'

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

  const [isDangerModeOn, setDangerModeOn] = useState(false)

  const invalidateRouteData = async () => {
    await queryClient.refetchQueries({ queryKey })
    await router.invalidate()
  }

  const { isPending, error, data } = useQuery({
    queryKey,
    queryFn: async () => getUserGalleryById(user?.uid || '-', galleryId),
  })

  if (error) return <Error message={error.message} fullHeight={false} />

  const isEmpty = !data?.photos?.length

  return (
    <section className="p-2 pt-0">
      {!!isPending && <FullWidthSpinner />}

      {!!data && (
        <>
          <div className="flex max-w-full items-center justify-between gap-2">
            <Link to="/gallery">
              <Button variant="outline">
                <ChevronLeft data-icon="inline-start" /> Back
              </Button>
            </Link>
            <div className="flex space-x-2">
              <Switch
                id="danger-mode"
                disabled={isEmpty}
                checked={!isEmpty && isDangerModeOn}
                onClick={() => setDangerModeOn((prev) => !prev)}
                className="data-[state=checked]:bg-red-400"
              />
              <Label
                htmlFor="danger-mode"
                className={`${!isEmpty && isDangerModeOn ? 'shimmer' : ''}`}
              >
                Danger mode
              </Label>
            </div>
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
            <div
              className={`grid transition-all duration-200 ${isDangerModeOn ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              {!!isDangerModeOn && !isEmpty && (
                <DeleteAllImagesButton
                  className="overflow-hidden"
                  galleryId={galleryId}
                  invalidateRouteData={invalidateRouteData}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <GalleryDetailsForm
                galleryData={{ ...data, galleryId }}
                onSave={invalidateRouteData}
              />

              {isEmpty && (
                <EmptyGalleryCard>
                  <div className="animate-wiggle">
                    <CloudinaryUploadWidget
                      galleryId={galleryId}
                      onUpload={[addPhotoToGallery, invalidateRouteData]}
                    />
                  </div>
                </EmptyGalleryCard>
              )}

              {!isEmpty && (
                <AdminPhotoList
                  photos={data?.photos}
                  galleryId={galleryId}
                  invalidateRouteData={invalidateRouteData}
                  isDangerModeOn={isDangerModeOn}
                />
              )}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
