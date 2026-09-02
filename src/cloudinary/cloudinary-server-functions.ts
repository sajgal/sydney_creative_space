import type { GalleryPhoto } from '#/types/gallery'
import { createServerFn } from '@tanstack/react-start'
import { v2 as cloudinary } from 'cloudinary'

interface CloudinaryError {
  error: {
    message: string
    http_code: number
  }
}

function isCloudinaryError(error: unknown): error is CloudinaryError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'error' in error &&
    typeof (error as any).error === 'object' &&
    'http_code' in (error as any).error
  )
}

export const destroyImage = createServerFn()
  .validator((data: { photo: GalleryPhoto }) => data)
  .handler(async ({ data: { photo } }) => {
    try {
      return await cloudinary.uploader.destroy(photo.id)
    } catch (error) {
      console.error(error)
      throw new Error('Cloudinary: Deleting image not successful')
    }
  })

export const destroyAllImagesByTag = createServerFn()
  .validator((data: { tag: string }) => data)
  .handler(async ({ data: { tag } }) => {
    try {
      return await cloudinary.api.delete_resources_by_tag(tag)
    } catch (error) {
      console.error(error)
      throw new Error('Cloudinary: Deleting images by tag not successful')
    }
  })

export const deleteEmptyFolder = createServerFn()
  .validator((data: { galleryId: string }) => data)
  .handler(async ({ data: { galleryId } }) => {
    try {
      return await cloudinary.api.delete_folder(galleryId)
    } catch (error) {
      if (isCloudinaryError(error) && error.error.http_code === 404) {
        // we don't want to throw any error if we receive 404
        // 404 happens when we're deleting gallery without any uploaded images
        return error.error.message
      }

      console.error(error)
      throw new Error('Cloudinary: Deleting folder not successful')
    }
  })
