import type { Gallery } from '#/types/gallery'
import { Link } from '@tanstack/react-router'
import { Separator } from './ui/separator'

export function GalleryLinksOld({ galleries }: { galleries: Array<Gallery> }) {
  if (galleries.length < 1) return <div></div>

  return galleries.map((gallery, index) => {
    return (
      <div key={index} className="">
        <Link to="/show/$galleryId" params={{ galleryId: gallery.id }}>
          <div className="relative flex">
            <div className="flex min-w-0 shrink-0 grow-0 basis-6 items-center justify-center">
              <div className="-rotate-90 flex-nowrap text-sm font-light text-nowrap text-gray-800">
                {/* <Link
                          to="/author/$authorIdOrName"
                          params={{
                            authorIdOrName: gallery.userData?.id || '-',
                          }}
                        > */}
                {gallery.userData?.displayName || 'Anonymous'}
                {/* </Link> */}
              </div>
            </div>
            <div className="absolute right-0 bottom-0 m-5 ml-11 flex w-fit flex-col items-end bg-white pr-2 pl-2 text-xl font-bold">
              <div className="text-pea">{gallery.title}</div>
              {/* <div className="text-sm font-light text-gray-800">
                        <Link
                          to="/author/$authorIdOrName"
                          params={{
                            authorIdOrName: gallery.userData?.id || '-',
                          }}
                        >
                          {gallery.userData?.displayName || 'Anonymous'}
                        </Link>
                      </div> */}
            </div>
            <img
              src={gallery.photos && gallery.photos[0].secure_url}
              className="h-56 w-full border-8 border-white object-cover"
            />
          </div>
        </Link>
        {/* <div className="mt-1 flex justify-end pr-2 text-sm font-light text-gray-800">
                  <span>
                    <Link
                      to="/author/$authorIdOrName"
                      params={{
                        authorIdOrName: gallery.userData?.id || '-',
                      }}
                    >
                      {gallery.userData?.displayName || 'Anonymous'}
                    </Link>
                    , {dayjs(gallery.publishedAt || 0).format('MMMM YYYY')}
                  </span>
                </div> */}
        <Separator className="mt-4" />
      </div>
    )
  })
}
