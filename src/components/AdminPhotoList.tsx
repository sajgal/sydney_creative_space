import type { GalleryPhoto } from '#/types/gallery'
import { move } from '@dnd-kit/helpers'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { Spinner } from './ui/spinner'
import { destroyImage } from '#/cloudinary/cloudinary-server-functions'
import { removePhotoFromGallery, updateGalleryField } from '#/firebase/gallery'
import { Button } from './ui/button'
import { Trash2 } from 'lucide-react'
import { Gallery } from './Gallery'

// Keep SortableItem above component context
const SortableItem = memo(
  ({
    id,
    index,
    photo,
    handleImageDelete,
    isDeleting,
    isDangerModeOn,
    ...props
  }: {
    id: string
    index: number
    photo: GalleryPhoto
    handleImageDelete: (
      event: React.MouseEvent<HTMLButtonElement>,
      photo: GalleryPhoto,
    ) => Promise<void>
    isDeleting: boolean
    isDangerModeOn: boolean
  }) => {
    const { ref } = useSortable({ id, index })

    return (
      <div {...props} ref={ref} className="flex flex-col">
        <img src={photo.thumbnail_url} className="h-36 object-cover" />
        <div
          className={`grid transition-all duration-200 ${isDangerModeOn ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
        >
          <div className="overflow-hidden">
            {!!isDangerModeOn && (
              <Button
                variant="destructive"
                onClick={(event) => handleImageDelete(event, photo)}
                className="animate-in slide-in-from-top w-full duration-200"
              >
                {!!isDeleting ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Trash2 data-icon="inline-start" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  },
)

export function AdminPhotoList({
  photos,
  galleryId,
  invalidateRouteData,
  isDangerModeOn,
}: {
  photos: Array<GalleryPhoto>
  galleryId: string
  invalidateRouteData: () => void
  isDangerModeOn: boolean
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
    async (event: React.MouseEvent<HTMLButtonElement>, photo: GalleryPhoto) => {
      event.stopPropagation()
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

  // this sensor section helps differenciate between drag and click
  const mouseSensor = useSensor(MouseSensor)
  const touchSensor = useSensor(TouchSensor)
  const keyboardSensor = useSensor(KeyboardSensor)
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 0.01,
    },
  })

  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
    pointerSensor,
  )

  return (
    <DndContext sensors={sensors}>
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
        <Gallery className="grid grid-cols-3 gap-2">
          {items.map((photo: GalleryPhoto, index: number) => (
            <SortableItem
              id={photo.id}
              index={index}
              photo={photo}
              key={photo.id}
              handleImageDelete={handleImageDelete}
              isDeleting={pendingDeleteImages.includes(photo.id)}
              isDangerModeOn={isDangerModeOn}
            />
          ))}
        </Gallery>
      </DragDropProvider>
    </DndContext>
  )
}
