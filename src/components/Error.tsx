import { MonitorX } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

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
        'flex items-center p-4 wrap-anywhere ' +
        (fullHeight === false ? 'max-h-fit' : 'min-h-screen')
      }
    >
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex flex-row justify-center gap-2">
            <MonitorX /> Error
          </CardTitle>
        </CardHeader>
        <CardContent>{message || 'Error, sorry'}</CardContent>
      </Card>
    </div>
  )
}
