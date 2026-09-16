import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'

export function SubHeader({
  title,
  author,
}: {
  title: string
  author?: string
}) {
  return (
    <header className="flex flex-row items-center justify-between">
      <Link className="grow-0" to="/">
        <Button variant="ghost">
          <ChevronLeft />
        </Button>
      </Link>
      <Link
        to="/"
        className="flex grow flex-col items-center border-2 text-right"
      >
        <h1 className="text-redred mb-1 flex w-full flex-col items-end border-2 font-serif font-black tracking-tighter sm:w-auto sm:items-center">
          <span className="text-3xl md:text-4xl lg:text-5xl">{title}</span>
        </h1>
        {!!author && (
          <div className="w-full border-2 text-xs font-light text-gray-500 sm:w-auto">
            by {author}
          </div>
        )}
      </Link>
    </header>
  )
}
