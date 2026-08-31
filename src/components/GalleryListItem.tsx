import { Image } from '@unpic/react'
import dayjs from 'dayjs'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { useNavigate } from '@tanstack/react-router'
import { DeleteGalleryAlertDialog } from './DeleteGalleryAlertDialog'

type Gallery = {
  id: string
  title?: string
  artist?: string
  album?: string
  duration?: string
  created?: number
  photos?: { thumbnail_url: string; secure_url: string }[]
}

export default function GalleryListItem({
  gallery,
  invalidateRouteData,
}: {
  gallery: Gallery
  invalidateRouteData: () => Promise<void>
}) {
  const formattedDate = dayjs(gallery.created || 0).format(
    'DD.MM.YYYY HH:mm:ss',
  )

  const thumbnailUrl =
    gallery?.photos && gallery?.photos[0] && gallery?.photos[0]?.thumbnail_url

  const navigate = useNavigate()

  return (
    <Item
      key={gallery.title || 'title'}
      variant="outline"
      asChild
      role="listitem"
    >
      <a
        onClick={() =>
          navigate({
            to: '/gallery/$galleryId',
            params: { galleryId: gallery.id },
          })
        }
      >
        <ItemMedia variant="image">
          <Image
            src={thumbnailUrl || `https://avatar.vercel.sh/mat`}
            alt={gallery.title || 'title'}
            width={32}
            height={32}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">
            {gallery.title || 'title'} -{' '}
            <span className="text-muted-foreground">{formattedDate}</span>
          </ItemTitle>
          <ItemDescription>{gallery.artist || gallery.id}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription onClick={(event) => event.stopPropagation()}>
            <DeleteGalleryAlertDialog
              galleryId={gallery.id}
              invalidateRouteData={invalidateRouteData}
            />
          </ItemDescription>
        </ItemContent>
      </a>
    </Item>
  )
}
