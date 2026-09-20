import { SquareDashed } from 'lucide-react'
import { Empty, EmptyContent, EmptyHeader, EmptyMedia } from './ui/empty'

export function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <Empty className="border border-dashed bg-white">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SquareDashed />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  )
}
