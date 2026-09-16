import { Spinner } from './ui/spinner'

export default function FullWidthSpinner({
  fullHeight,
}: {
  fullHeight?: boolean
}) {
  return (
    <div
      className={
        'flex w-full items-center justify-center p-4 ' +
        (fullHeight === true ? 'h-screen' : 'h-fit')
      }
    >
      <Spinner className="size-10" />
    </div>
  )
}
