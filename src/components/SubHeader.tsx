import { Link, useCanGoBack, useRouter } from '@tanstack/react-router'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'

export function SubHeader({
  title,
  author,
}: {
  title: string
  author?: string
}) {
  const router = useRouter()
  const canGoBack = useCanGoBack()

  return (
    <header className="flex flex-row items-center justify-between">
      {canGoBack ? (
        <Button onClick={() => router.history.back()} variant="ghost">
          <ChevronLeft />
        </Button>
      ) : (
        <Link className="grow-0" to="/">
          <Button variant="ghost">
            <ChevronLeft />
          </Button>
        </Link>
      )}

      <Link
        to="/"
        className="flex grow flex-col items-center text-right sm:text-center"
      >
        <h1 className="text-redred mb-1 flex w-full flex-col items-end font-serif font-black tracking-tighter sm:w-auto sm:items-center">
          <span className="text-3xl md:text-4xl lg:text-5xl">{title}</span>
        </h1>
        {!!author && (
          <div className="w-full text-xs font-light text-gray-500 sm:w-auto">
            by {author}
          </div>
        )}
      </Link>
    </header>
  )
}
