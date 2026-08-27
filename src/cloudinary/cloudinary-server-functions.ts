import type { GalleryPhoto } from '#/routes/_auth.gallery.$galleryId'
import { createServerFn } from '@tanstack/react-start'
import { v2 as cloudinary } from 'cloudinary'

export const destroyImage = createServerFn()
  .validator((data: { photo: GalleryPhoto }) => data)
  .handler(async ({ data: { photo } }) => {
    try {
      return await cloudinary.uploader
        .destroy(photo.public_id)
        .then((resp) => {
          return { error: false, response: resp }
        })
        .catch((error: Error) => {
          return { error: true, response: error }
        })
    } catch (error) {
      // if cloudinary is not set up properly
      return { error: true, response: error }
    }
  })
