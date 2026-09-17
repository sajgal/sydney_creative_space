import { createFileRoute } from '@tanstack/react-router'
import { ProfileForm } from '#/components/ProfileForm'
import { useAuth } from '#/auth'
import type { User } from '#/types/user'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { addUser, getUserData } from '#/firebase/user'
import { Error } from '#/components/Error'
import FullWidthSpinner from '#/components/FullWidthSpinner'

export const Route = createFileRoute('/_auth/about-me')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const queryKey = ['userData', user?.uid]

  const invalidateQueryData = async () => {
    await queryClient.refetchQueries({ queryKey })
  }

  if (!user) {
    return <Error message={'Could not get user data.'} fullHeight={false} />
  }

  const { isPending, error, data } = useQuery({
    queryKey,
    queryFn: async () => {
      const userData = await getUserData(user.uid)

      if (userData === undefined) {
        return await addUser(user.uid)
      }

      return userData
    },
  })

  if (error) return <Error message={error.message} fullHeight={false} />

  return (
    <section className="p-2 pt-0">
      {!!isPending && <FullWidthSpinner />}

      {!!data && (
        <ProfileForm userData={data as User} onSave={invalidateQueryData} />
      )}
    </section>
  )
}
