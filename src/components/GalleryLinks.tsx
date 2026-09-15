import type { Gallery } from '#/types/gallery'
import { Link } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from './ui/separator'
import dayjs from 'dayjs'

export function GalleryLinks({ galleries }: { galleries: Array<Gallery> }) {
  if (galleries.length < 1) return <div></div>

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {galleries.map((gallery, index) => {
        return (
          <Card key={index} className="relative mx-auto w-full max-w-sm p-0">
            <Link to="/show/$galleryId" params={{ galleryId: gallery.id }}>
              <div className="absolute inset-0 z-30 aspect-video" />
              <img
                src={gallery.photos && gallery.photos[0].secure_url}
                alt="Event cover"
                className="relative z-20 aspect-video w-full object-cover"
              />
            </Link>
            <CardHeader>
              {index === 0 && (
                <CardAction>
                  <Badge variant="default">New</Badge>
                </CardAction>
              )}
              <CardTitle className="line-clamp-2">
                <Link to="/show/$galleryId" params={{ galleryId: gallery.id }}>
                  {gallery.title || '-'}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-3">
                <div>{gallery.description || '-'}</div>
              </CardDescription>
            </CardHeader>
            <CardFooter className="bg-muted flex flex-col border-t pb-5">
              <Link
                className="mb-3 w-full"
                to="/show/$galleryId"
                params={{ galleryId: gallery.id }}
              >
                <Button className="w-full">View Gallery</Button>
              </Link>
              <div className="flex w-full justify-between gap-4 text-xs font-light text-gray-500">
                <Link
                  to="/author/$authorIdOrName"
                  params={{ authorIdOrName: gallery.userId }}
                >
                  {gallery.userData?.displayName || 'Anonymous'}
                </Link>
                <Separator orientation="vertical" />
                {dayjs(gallery.publishedAt).format('MMMM YYYY')}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
