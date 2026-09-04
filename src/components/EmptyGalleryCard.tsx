import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Ghost } from 'lucide-react'

export function EmptyGalleryCard({ children }: { children: React.ReactNode }) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Ghost />
        </EmptyMedia>
        <EmptyTitle>This is the emptiest gallery so far</EmptyTitle>
        <EmptyDescription>
          Would be nice if you could upload some pics.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{children}</EmptyContent>
    </Empty>
  )
}
