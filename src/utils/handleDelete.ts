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
  await destroyAllImagesByTag({ data: { tag: galleryId } })
  await deleteEmptyFolder({ data: { galleryId } })
  await deleteFirestoreGallery(galleryId)

  !!onDelete && (await onDelete())

  return
}

export const deleteAllGalleryPhotos = async (
  galleryId: string,
  onDelete?: () => void,
) => {
  await destroyAllImagesByTag({ data: { tag: galleryId } })
  await deleteEmptyFolder({ data: { galleryId } })
  await removeAllPhotosFromGallery(galleryId)

  !!onDelete && (await onDelete())

  return
}
