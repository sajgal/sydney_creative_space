import { Spinner } from './ui/spinner'

export default function FullWidthSpinner() {
  return (
    <div className="flex w-full items-center justify-center p-4">
      <Spinner className="size-10" />
    </div>
  )
}
