import { publishGallery, unpublishGallery } from '#/firebase/gallery'
import { useState } from 'react'
import { Button } from './ui/button'
import { Spinner } from './ui/spinner'
import dayjs from 'dayjs'

export function GalleryStatus({
  publishedAt,
  serverTime,
  galleryId,
  invalidateRouteData,
}: {
  publishedAt: number
  serverTime: number
  galleryId: string
  invalidateRouteData: () => Promise<void>
}) {
  const published = publishedAt <= serverTime
  const [isPending, setIsPending] = useState(false)
  const formattedDate = dayjs(publishedAt || 0).format(
    'DD.MM.YYYY HH:mm:ss',
  )

  const handlePublish = async () => {
    setIsPending(true)
    await publishGallery(galleryId)
    await invalidateRouteData()
    setIsPending(false)
  }

  const handleUnPublish = async () => {
    setIsPending(true)
    await unpublishGallery(galleryId)
    await invalidateRouteData()
    setIsPending(false)
  }

  return (
    <div className="flex items-center gap-2">
      {published ? (
        <Button variant="destructive" onClick={() => handleUnPublish()}>
          {!!isPending && <Spinner data-icon="inline-start" />}
          Unpublish
        </Button>
      ) : (
        <Button onClick={() => handlePublish()}>
          {!!isPending && <Spinner data-icon="inline-start" />}
          Publish
        </Button>
      )}
      {!isPending && (
        <p className="text-sidebar-ring">
          {published ? `Published on ${formattedDate}` : 'Not published yet'}
        </p>
      )}
    </div>
  )
}
