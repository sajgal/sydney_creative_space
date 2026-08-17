import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/gallery/$galleryId')({
  component: RouteComponent,
  notFoundComponent: () => {
    return <p>Gallery not found</p>
  },
  loader: ({ params: { galleryId } }) => {
    return galleryId
  },
})

function RouteComponent() {
  const data = Route.useLoaderData()
  console.log('------------ data', data)

  return <div>Hello "/_auth/gallery/{`${data}`}"!</div>
}
