import type { Gallery } from '#/types/gallery'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Card, CardTitle } from '@/components/ui/card'
import { Separator } from './ui/separator'
import dayjs from 'dayjs'

export function GalleryLinks({ galleries }: { galleries: Array<Gallery> }) {
  if (galleries.length < 1) return <div></div>

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {galleries.map((gallery, index) => {
        return (
          <Card
            key={index}
            className="mx-auto flex w-full max-w-sm justify-between gap-2 p-0"
          >
            <div className="flex flex-col p-0">
              <Link to="/gallery/$galleryId" params={{ galleryId: gallery.id }}>
                <img
                  src={gallery.photos && gallery.photos[0].secure_url}
                  alt="Event cover"
                  className="aspect-video w-full object-cover"
                />
              </Link>
              <div className="flex justify-between px-6 pt-4">
                <CardTitle className="line-clamp-2">
                  <Link
                    to="/gallery/$galleryId"
                    params={{ galleryId: gallery.id }}
                  >
                    {gallery.title || '-'}
                  </Link>
                </CardTitle>
                {index === 0 && (
                  <Badge variant="default" className="hidden sm:flex">
                    New
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex w-full justify-between gap-4 px-6 pb-4 text-xs font-light text-gray-500">
              <Link
                to="/author/$authorIdOrName"
                params={{ authorIdOrName: gallery.userId }}
              >
                {gallery.userData?.displayName || 'Anonymous'}
              </Link>
              <Separator orientation="vertical" />
              {dayjs(gallery.publishedAt).format('MMMM YYYY')}
            </div>
          </Card>
        )
      })}
    </div>
  )
}
