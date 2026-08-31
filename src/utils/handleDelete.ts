import {
  deleteEmptyFolder,
  destroyAllImagesByTag,
} from '#/cloudinary/cloudinary-server-functions'
import {
  removeAllPhotosFromGallery,
  deleteGallery as deleteFirestoreGallery,
} from '#/firebase/gallery'

export const deleteGallery = async (
  galleryId: string,
  onDelete?: () => Promise<void>,
) => {
  const imagesDeleted = await destroyAllImagesByTag({
    data: { tag: galleryId },
  })

  if (imagesDeleted.error) {
    throw new Error(imagesDeleted.response)
  }

  const folderDeleted = await deleteEmptyFolder({
    data: { galleryId },
  })

  if (folderDeleted.error) {
    throw new Error(folderDeleted.response)
  }

  await deleteFirestoreGallery(galleryId)

  !!onDelete && (await onDelete())

  return
}

export const deleteAllGalleryPhotos = async (
  galleryId: string,
  onDelete?: () => void,
) => {
  const imagesDeleted = await destroyAllImagesByTag({
    data: { tag: galleryId },
  })

  if (imagesDeleted.error) {
    throw new Error(imagesDeleted.response)
  }

  const folderDeleted = await deleteEmptyFolder({
    data: { galleryId },
  })

  if (folderDeleted.error) {
    throw new Error(folderDeleted.response)
  }

  await removeAllPhotosFromGallery(galleryId)

  !!onDelete && (await onDelete())

  return
}
