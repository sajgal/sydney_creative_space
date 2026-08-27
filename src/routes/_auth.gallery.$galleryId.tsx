import { createFileRoute } from '@tanstack/react-router'

import { CloudinaryUploadWidget } from '#/components/CloudinaryUploadWidget'
import { addPhotoToGallery, getGalleryById } from '#/firebase/gallery'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import { useAuth } from '#/auth'
import { Error } from '#/components/Error'
// import cloudinary from "cloudinary";

export const Route = createFileRoute('/_auth/gallery/$galleryId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { galleryId } = Route.useParams()
  const queryClient = useQueryClient()
  const queryKey = ['galleryData', galleryId]
  const { user } = useAuth()

  const invalidateQuery = () => queryClient.invalidateQueries({ queryKey })

  const { isPending, error, data } = useQuery({
    queryKey,
    queryFn: async () => getGalleryById(user?.uid || '-', galleryId),
  })

  // const deleteImage = async (e) => {
  // e.preventDefault();
  //   cloudinary.v2.uploader.destroy('XUUoZkWwAIVSEYeYec9O/k5i1vbjug5v0pqaqlqgu', function(error,result) {
  //     console.log(result, error) })
  //     .then(resp => console.log(resp))
  //     .catch(_err=> console.log("Something went wrong, please try again later."));
  // }

  if (error) return <Error message={error.message} fullHeight={false} />

  return (
    <section className="p-2 pt-0">
      {!!isPending && <FullWidthSpinner />}

      {!!data && (
        <>
          <div className="flex max-w-full items-end justify-end">
            <CloudinaryUploadWidget
              galleryId={galleryId}
              onUpload={[addPhotoToGallery, invalidateQuery]}
            />
          </div>
          <div className="mt-4 flex max-w-full flex-col">
            <div className="flex gap-2">
              {!data?.photos?.length && <div>No photos yet.</div>}
              {data?.photos?.length &&
                data.photos.map(
                  (photo: { thumbnail_url: string }, key: number) => (
                    <img key={key} src={photo.thumbnail_url} />
                  ),
                )}
            </div>
          </div>
        </>
      )}
    </section>
  )
}
