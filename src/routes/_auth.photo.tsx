import { createFileRoute } from '@tanstack/react-router'
import Base64 from 'base64-transcode';
// import { v2 as cloudinary } from 'cloudinary'

import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget'
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
  loader: async () => {
    const data = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME}/resources/image`,
      {
        method: 'get',
        headers: {
          'Authorization': 'Basic ' + Base64.encode(import.meta.env.VITE_PUBLIC_CLOUDINARY_KEY + ":" + import.meta.env.VITE_PUBLIC_CLOUDINARY_SECRET),
      },
    }).then(res => res.json());

    return data;

  },
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
