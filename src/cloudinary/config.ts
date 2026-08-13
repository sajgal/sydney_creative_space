import { Cloudinary } from '@cloudinary/url-gen'
import { createServerFn } from '@tanstack/react-start'
import Base64 from 'base64-transcode'
// import { v2 as cloudinary } from 'cloudinary'

export const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME,
  },
})

export const getFolder = createServerFn().handler(async () => {
  return await fetch(
    'https://api.cloudinary.com/v1_1/dqjl6uv1s/resources/image',
    {
      method: 'get',
      headers: {
        Authorization:
          'Basic ' +
          Base64.encode(
            import.meta.env.VITE_PUBLIC_CLOUDINARY_KEY +
              ':' +
              import.meta.env.VITE_PUBLIC_CLOUDINARY_SECRET,
          ),
      },
    },
  ).then((res) => res.json())

  // return data;
})
