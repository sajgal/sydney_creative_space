import { Link } from '@tanstack/react-router'
import { Button } from './ui/button'
import { Card, CardFooter, CardHeader } from './ui/card'
import { SquareX } from 'lucide-react'

export function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-sm p-0">
        <CardHeader className="flex flex-col items-center pt-6">
          <SquareX />
          The page you are looking for does not exist.
        </CardHeader>
        <CardFooter className="bg-accent flex-col gap-2 p-4">
          <Button
            onClick={() => window.history.back()}
            className="w-full bg-amber-200 px-2 py-1 text-sm"
          >
            Go back
          </Button>
          <Link to="/" className="w-full text-sm">
            <Button className="w-full">Start Over</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
