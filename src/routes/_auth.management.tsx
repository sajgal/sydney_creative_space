import { Error } from '#/components/Error'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import GalleryListItem from '#/components/GalleryListItem'
import { ItemGroup } from '#/components/ui/item'
import { getGalleriesThatAreWaitingForApproval } from '#/firebase/gallery'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/management')({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    if (!context.auth.isSuperAdmin) {
      throw redirect({
        to: '/admin',
      })
    }
  },
})

function RouteComponent() {
  const queryKey = ['managementGalleryList']
  const router = useRouter()
  const queryClient = useQueryClient()

  const { isPending, error, data } = useQuery({
    queryKey,
    queryFn: async () => getGalleriesThatAreWaitingForApproval(),
  })

  const invalidateRouteData = async () => {
    await queryClient.refetchQueries({ queryKey })
    await router.invalidate()
  }

  if (error) return <Error message={error.message} fullHeight={false} />

  return (
    <section className="p-2 pt-0">
      <div className="flex max-w-full items-end justify-between">
        <h1 className="text-lg font-semibold">
          Galleries waiting for approval:
        </h1>
      </div>

      {!!isPending && <FullWidthSpinner />}

      {!!data && (
        <div className="mt-4 flex max-w-full flex-col">
          <ItemGroup className="gap-2">
            {data.map((gallery, key) => (
              <GalleryListItem
                key={key}
                gallery={gallery}
                invalidateRouteData={invalidateRouteData}
              />
            ))}
          </ItemGroup>
        </div>
      )}

      {!isPending && !data.length && <div>No galleries for approval</div>}
    </section>
  )
}
