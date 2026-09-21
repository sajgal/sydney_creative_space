import dayjs from 'dayjs'

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { useNavigate } from '@tanstack/react-router'
import { DeleteGalleryAlertDialog } from './DeleteGalleryAlertDialog'
import type { Gallery } from '#/types/gallery'
import { datetimeFormat } from '#/utils/dateFormat'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'

export default function GalleryListItem({
  gallery,
  invalidateRouteData,
}: {
  gallery: Gallery
  invalidateRouteData: () => Promise<void>
}) {
  const formattedDate = dayjs(gallery.createdDate || 0).format(datetimeFormat)

  const thumbnailUrl =
    gallery?.photos && gallery?.photos[0] && gallery?.photos[0]?.thumbnail_url

  const navigate = useNavigate()

  return (
    <Item
      key={gallery.title || 'title'}
      variant="outline"
      asChild
      role="listitem"
      className="flex"
    >
      <a
        className="cursor-pointer"
        onClick={() =>
          navigate({
            to: '/admin/gallery/$galleryId',
            params: { galleryId: gallery.id },
          })
        }
      >
        <img
          src={thumbnailUrl || `https://avatar.vercel.sh/mat`}
          alt={gallery.title || 'title'}
          className="aspect-video w-full object-cover sm:aspect-square sm:size-16"
        />
        <ItemContent>
          <ItemTitle className="line-clamp-1">
            {gallery.title || '-- title not set --'}
          </ItemTitle>
          <div className="text-muted-foreground line-clamp-1 flex justify-between gap-2 text-left text-sm leading-normal font-normal sm:flex-row sm:justify-start">
            <span className="text-muted-foreground line-clamp-1">
              {formattedDate}
            </span>
            <Separator orientation="vertical" className="hidden sm:block" />
            {!gallery.isWaitingForApproval && !gallery.isApproved && (
              <Badge variant="outline">Draft</Badge>
            )}
            {!!gallery.isWaitingForApproval && (
              <Badge variant="outline" className="bg-amber-100">
                Pending
              </Badge>
            )}
            {!!gallery.isApproved && (
              <Badge variant="outline" className="bg-lime-200">
                Approved
              </Badge>
            )}
          </div>
        </ItemContent>
        <ItemContent className="w-full flex-none text-center sm:w-fit">
          <ItemDescription onClick={(event) => event.stopPropagation()}>
            <DeleteGalleryAlertDialog
              className="w-full"
              galleryId={gallery.id}
              invalidateRouteData={invalidateRouteData}
            />
          </ItemDescription>
        </ItemContent>
      </a>
    </Item>
  )
}
