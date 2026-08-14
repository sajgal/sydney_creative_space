import { createFileRoute } from '@tanstack/react-router'
// import Base64 from 'base64-transcode'
// import { v2 as cloudinary } from 'cloudinary'

import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget'
import { getFolder } from '@/cloudinary/server'
// import { cld } from '../cloudinary/config'
// import { useEffect } from 'react'
// import { getFolder } from '@/cloudinary/config'

// cloudinary.config({
//   cloud_name: import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: import.meta.env.VITE_PUBLIC_CLOUDINARY_KEY,
//   api_secret: import.meta.env.VITE_PUBLIC_CLOUDINARY_SECRET,
// })

export const Route = createFileRoute('/_auth/photo')({
  component: RouteComponent,
  loader: () => [], //getFolder(),
})

function RouteComponent() {
  const posts = Route.useLoaderData()

  // useEffect(() => {
  //   console.log('using effect, searching photos', posts);

  //   return;
  // }, [posts])

  console.log('--------- posts', posts)

  return (
    <div>
      <div>Hello, try to upload an image</div>
      <CloudinaryUploadWidget testingFolder="whoa" />
    </div>
  )
}
