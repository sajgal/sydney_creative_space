import { Film } from 'lucide-react'

export function Error({
  message,
  fullHeight,
}: {
  fullHeight?: boolean
  message?: string
}) {
  return (
    <div
      className={
        'flex w-full max-w-screen flex-col items-center justify-center p-4 ' +
        (fullHeight === false ? '' : 'h-screen')
      }
    >
      <Film />
      {message || 'Error, sorry'}
    </div>
  )
}
