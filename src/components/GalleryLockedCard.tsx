import { LockKeyhole } from 'lucide-react'

export function GalleryLockedCard() {
  return (
    <div className="flex flex-col items-center gap-2 border-2 border-dashed border-red-600 bg-red-100 px-2 py-4">
      <LockKeyhole />
      <div className="text-center">
        Your gallery is published, so editing is <b>turned off</b>.
        <br />
        If you want to upload more pictures, change the title or description,
        please <b>unpublish</b> the gallery first.
      </div>
    </div>
  )
}
