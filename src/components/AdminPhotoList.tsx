import type { GalleryPhoto } from '#/types/gallery'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Spinner } from './ui/spinner'
import { destroyImage } from '#/cloudinary/cloudinary-server-functions'
import { removePhotoFromGallery, updateGalleryField } from '#/firebase/gallery'

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

    if (isDeleting) return <Spinner className="size-14" />

    return (
      <div ref={ref}>
        <img src={photo.thumbnail_url} />
        <button onClick={() => handleImageDelete(photo)}>Delete</button>
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
  const [pendingDeleteImageId, setPendingDeleteImageId] = useState('')

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
      setPendingDeleteImageId(photo.id)

      const { error, response } = await destroyImage({ data: { photo } })

      if (error) {
        console.error(response)
        return setPendingDeleteImageId('')
      }

      await removePhotoFromGallery(galleryId, photo)
      await invalidateRouteData()
      setPendingDeleteImageId('')
    },
    [galleryId],
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
            isDeleting={pendingDeleteImageId === photo.id}
          />
        ))}
      </DragDropProvider>
    </div>
  )
}
