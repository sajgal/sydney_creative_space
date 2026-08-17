import { createFileRoute } from '@tanstack/react-router'
import { CloudinaryUploadWidget } from '@/components/CloudinaryUploadWidget'

export const Route = createFileRoute('/_auth/gallery/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div>Hello, try to upload an image</div>
      <CloudinaryUploadWidget testingFolder="whoa" />
    </div>
  )
}
