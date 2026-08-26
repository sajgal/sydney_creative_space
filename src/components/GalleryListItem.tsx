import { Image } from '@unpic/react'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Link } from '@tanstack/react-router'

type Gallery = {
  id: string,
  title?: string
  artist?: string
  album?: string
  duration?: string
}

export default function GalleryListItem({ gallery }: { gallery: Gallery }) {
  return (
    <Item
      key={gallery.title || 'title'}
      variant="outline"
      asChild
      role="listitem"
    >
      <Link to="/gallery/$galleryId" params={{galleryId: gallery.id}}>
        <ItemMedia variant="image">
          <Image
            src={`https://avatar.vercel.sh/${gallery.title || 'title'}`}
            alt={gallery.title || 'title'}
            width={32}
            height={32}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle className="line-clamp-1">
            {gallery.title || 'title'} -{' '}
            <span className="text-muted-foreground">
              {gallery.album || 'album'}
            </span>
          </ItemTitle>
          <ItemDescription>{gallery.artist || gallery.id}</ItemDescription>
        </ItemContent>
        <ItemContent className="flex-none text-center">
          <ItemDescription>{gallery.duration || '3:21'}</ItemDescription>
        </ItemContent>
      </Link>
    </Item>
  )
}
