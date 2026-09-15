import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { ChevronLeft } from 'lucide-react'

export function SubHeader({
  title,
  author,
}: {
  title: string
  author: string
}) {
  return (
    <header className="flex flex-col items-center justify-between sm:flex-row">
      <Link className="hidden grow-0 sm:block" to="/">
        <Button variant="ghost">
          <ChevronLeft />
        </Button>
      </Link>
      <Link to="/" className="flex flex-1 flex-col items-center">
        <h1 className="text-redred mb-1 flex flex-col items-center font-serif font-black tracking-tighter">
          <span className="text-center text-3xl md:text-4xl lg:text-5xl">
            {title}
          </span>
        </h1>
        <div className="text-xs font-light text-gray-500">By {author}</div>
      </Link>
    </header>
  )
}
