import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget'
import { addPhotoToGallery } from '@/firebase/gallery'
import { createFileRoute } from '@tanstack/react-router'
// import cloudinary from "cloudinary";

export const Route = createFileRoute('/_auth/gallery/$galleryId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { galleryId } = Route.useParams()

  //get gallery data

  //redirect if gallery doesn't belong to the user or doesn't exist, add toast

  // const deleteImage = async (e) => {
  // e.preventDefault();
  //   cloudinary.v2.uploader.destroy('XUUoZkWwAIVSEYeYec9O/k5i1vbjug5v0pqaqlqgu', function(error,result) {
  //     console.log(result, error) })
  //     .then(resp => console.log(resp))
  //     .catch(_err=> console.log("Something went wrong, please try again later."));
  // }

  return (
    <div>
      <p>Hello "/_auth/gallery/{`${galleryId}`}"!</p>
      <CloudinaryUploadWidget
        galleryId={galleryId}
        onUpload={addPhotoToGallery}
      />
      {/* <button onClick={deleteImage}>Remove</button> */}
    </div>
  )
}
