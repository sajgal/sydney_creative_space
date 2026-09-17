import { Error } from '#/components/Error'
import FullWidthSpinner from '#/components/FullWidthSpinner'
import { Header } from '#/components/Header'
import { Button } from '#/components/ui/button'
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from '#/components/ui/item'
import { Separator } from '#/components/ui/separator'
import { getPublishedUsers } from '#/firebase/user'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/photographers')({
  component: RouteComponent,
})

function RouteComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ['photographers'],
    queryFn: async () => getPublishedUsers(),
  })

  if (error) {
    return <Error message={error.message} />
  }

  if (!isPending && data && data?.length === 0) {
    return <div>Empty</div>
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Header />

      <Separator className="my-4" />

      <section className="mt-2 mb-6">
        {!!isPending && <FullWidthSpinner />}

        {!!data &&
          data.map((user, index) => (
            <Item key={index} variant="outline" className="bg-white">
              <ItemContent>
                <ItemTitle>
                  <Link
                    to="/author/$authorIdOrName"
                    params={{ authorIdOrName: user.id }}
                    className="relative"
                  >
                    <h1 className="text-redred absolute right-0 bottom-0 m-2 flex w-min flex-col items-center bg-white px-2 py-1 text-right font-serif text-2xl font-black tracking-tighter sm:w-auto md:text-3xl lg:text-4xl">
                      {user.displayName}
                    </h1>
                    <img
                      src={user.avatar?.secure_url}
                      alt={user.displayName + '`s avatar'}
                      className="aspect-video object-cover"
                    />
                  </Link>
                </ItemTitle>
                <ItemDescription className="mt-2">
                  <span className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <span className="line-clamp-3">{user.bio}</span>
                    <Link
                      to="/author/$authorIdOrName"
                      params={{ authorIdOrName: user.id }}
                      className="text-right"
                    >
                      <Button size="sm" variant="outline">
                        Show Galleries <ChevronRight data-icon="inline-end" />
                      </Button>
                    </Link>
                  </span>
                </ItemDescription>
              </ItemContent>
            </Item>
          ))}
      </section>
    </div>
  )
}
