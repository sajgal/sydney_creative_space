import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

import { useAuth } from '#/auth'
import { Button } from '#/components/ui/button'
import { addGallery, getUserGalleries } from '#/firebase/gallery'
import GalleryListItem from '#/components/GalleryListItem'
import { ItemGroup } from '#/components/ui/item'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import { Error } from '#/components/Error'

export const Route = createFileRoute('/_auth/gallery/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const userId = user?.uid ?? '-'

  const { isPending, error, data } = useQuery({
    queryKey: ['galleryList'],
    queryFn: async () => getUserGalleries(userId),
  })

  const handleNewGalleryClick = async () => {
    const galleryId = await addGallery(userId)
    navigate({ to: '/gallery/$galleryId', params: { galleryId } })
  }

  if (error) return <Error message={error.message} fullHeight={false} />

  return (
    <section className="p-2 pt-0">
      <div className="flex max-w-full items-end justify-between">
        <h1 className="text-lg font-semibold">Your galleries:</h1>
        <Button className="max-w-xs" onClick={handleNewGalleryClick}>
          <Plus /> New gallery
        </Button>
      </div>

      {!!isPending && <FullWidthSpinner />}

      {!!data && (
        <div className="mt-4 flex max-w-full flex-col">
          <ItemGroup className="gap-2">
            {data.map((doc, key) => (
              <GalleryListItem
                key={key}
                gallery={{ ...doc.data(), id: doc.id }}
              />
            ))}
          </ItemGroup>
        </div>
      )}

      {!isPending && !data.length && <div>No galleries yet</div>}
    </section>
  )
}
