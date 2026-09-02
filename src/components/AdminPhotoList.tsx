import type { GalleryPhoto } from '#/types/gallery'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Spinner } from './ui/spinner'
import { destroyImage } from '#/cloudinary/cloudinary-server-functions'
import { removePhotoFromGallery, updateGalleryField } from '#/firebase/gallery'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'

// Keep SortableItem above component context
const SortableItem = memo(
  ({
    id,
    index,
    photo,
    handleImageDelete,
    isDeleting,
  }: {
    id: string
    index: number
    photo: GalleryPhoto
    handleImageDelete: (photo: GalleryPhoto) => Promise<void>
    isDeleting: boolean
  }) => {
    const { ref } = useSortable({ id, index })

    return (
      <div ref={ref} className="flex max-w-24 flex-col">
        <img src={photo.thumbnail_url} />
        <Button variant="destructive" onClick={() => handleImageDelete(photo)}>
          {!!isDeleting ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Trash2 data-icon="inline-start" />
          )}
        </Button>
      </div>
    )
  },
)

export function AdminPhotoList({
  photos,
  galleryId,
  invalidateRouteData,
}: {
  photos: Array<GalleryPhoto>
  galleryId: string
  invalidateRouteData: () => void
}) {
  const isDragging = useRef(false)
  const [items, setItems] = useState(photos ?? [])
  const [pendingDeleteImages, setPendingDeleteImages] = useState(
    [] as Array<string>,
  )

  useEffect(() => {
    if (photos && !isDragging.current) {
      setItems(photos)
    }
  }, [photos])

  useEffect(() => {
    if (!!items.length && items !== photos) {
      updateGalleryField(galleryId, 'photos', items)
    }
  }, [items])

  const handleImageDelete = useCallback(
    async (photo: GalleryPhoto) => {
      setPendingDeleteImages([...pendingDeleteImages, photo.id])

      const { error, response } = await destroyImage({ data: { photo } })

      if (error) {
        console.error(response)
        return setPendingDeleteImages(
          pendingDeleteImages.splice(pendingDeleteImages.indexOf(photo.id), 1),
        )
      }

      await removePhotoFromGallery(galleryId, photo)
      await invalidateRouteData()
      setPendingDeleteImages(
        pendingDeleteImages.splice(pendingDeleteImages.indexOf(photo.id), 1),
      )
    },
    [galleryId, pendingDeleteImages],
  )

  return (
    <div className="mx-auto flex gap-4">
      <DragDropProvider
        onDragStart={() => {
          isDragging.current = true
        }}
        onDragEnd={(event) => {
          isDragging.current = false

          if (event.canceled) {
            // Reset to server state on cancel
            setItems(photos ?? [])
            return
          }

          // Update local state, then sync with server in useEffect
          setItems((items: Array<GalleryPhoto>) => move(items, event))
        }}
      >
        {items.map((photo: GalleryPhoto, index: number) => (
          <SortableItem
            id={photo.id}
            index={index}
            photo={photo}
            key={photo.id}
            handleImageDelete={handleImageDelete}
            isDeleting={pendingDeleteImages.includes(photo.id)}
          />
        ))}
      </DragDropProvider>
    </div>
  )
}
