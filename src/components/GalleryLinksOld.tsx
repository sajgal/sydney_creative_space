import type { Gallery } from '#/types/gallery'
import { Link } from '@tanstack/react-router'
import { Ghost } from 'lucide-react'

export function GalleryLinksOld({ galleries }: { galleries: Array<Gallery> }) {
  if (galleries.length < 1)
    return (
      <div className="flex w-full flex-col items-center">
        <Ghost size={40} />
        Empty
      </div>
    )

  return galleries.map((gallery, index) => {
    return (
      <div key={index} className="">
        <Link to="/show/$galleryId" params={{ galleryId: gallery.id }}>
          <div className="relative overflow-hidden">
            <div className="absolute right-0 bottom-0 m-5 ml-11 line-clamp-5 w-fit items-end bg-white pr-2 pl-2 text-xl font-bold">
              {gallery.title}
            </div>
            <img
              src={gallery.photos && gallery.photos[0].secure_url}
              className="h-72 w-full border-8 border-white object-cover"
            />
          </div>
        </Link>
      </div>
    )
  })
}
