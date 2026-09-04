import { createFileRoute, Link } from '@tanstack/react-router'
import { ShieldKeyhole } from 'lucide-react'

import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { getPublishedGalleries } from '#/firebase/gallery'
import { Error } from '#/components/Error'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import type { Gallery } from '#/types/gallery'
import dayjs from 'dayjs'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ['homepagee'],
    queryFn: async () => getPublishedGalleries(),
  })

  const isEmpty = !isPending && data && data?.length === 0

  if (error) {
    return <Error message={error.message} />
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <section className="mb-6 flex items-center justify-between">
        <h1 className="mb-4 text-2xl font-bold">
          Sydney
          <br />
          Creative
          <br />
          .space
        </h1>

        <Link to="/gallery">
          <Button size="icon-lg" aria-label="Admin" variant="outline">
            <ShieldKeyhole />
          </Button>
        </Link>
      </section>

      <Separator />

      <section className="mt-2 mb-6 flex flex-col gap-4">
        {!!isPending && <FullWidthSpinner />}

        {!!isEmpty && <div>Empty :( </div>}

        {data &&
          data.map((rawGallery, index) => {
            const gallery = rawGallery.data() as Gallery

            return (
              <div key={index}>
                <Link
                  to="/show/$galleryId"
                  params={{ galleryId: rawGallery.id }}
                >
                  <img
                    src={gallery.photos && gallery.photos[0].secure_url}
                    className="h-56 w-full border-8 border-white object-cover"
                  />
                </Link>
                <div className="flex justify-between">
                  <div>
                    <span>{gallery.title}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>By Matej</span>
                    <span>
                      {dayjs(gallery.publishedAt || 0).format('MMMM YYYY')}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
      </section>
    </div>
  )
}
