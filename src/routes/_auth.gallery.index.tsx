import { useAuth } from '@/auth'
import { Button } from '@/components/ui/button'
import { db } from '@/firebase/config'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { addDoc, collection } from 'firebase/firestore'
import { addGallery, getUserGalleries } from '@/firebase/gallery'
import { useQuery } from '@tanstack/react-query'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_auth/gallery/')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const userId = user?.uid ?? '-'

  const { isPending, error, data } = useQuery({
    queryKey: ['galleryData'],
    queryFn: async () => getUserGalleries(userId),
  })

  const handleNewGalleryClick = async () => {
    const galleryId = await addGallery(userId)
    navigate({ to: '/gallery/$galleryId', params: { galleryId } })
  }

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <div className="mt-3">
        {data.map((doc, key) => {
          // const {userId} = doc.data()
          return (
            <div key={key}>
              <Link to="/gallery/$galleryId" params={{ galleryId: doc.id }}>
                Gallery: {doc.id}
              </Link>
            </div>
          )
        })}
      </div>
      <Separator className="my-6" />
      <Button onClick={handleNewGalleryClick}>Create new gallery</Button>
    </div>
  )
}
