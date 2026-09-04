import { FileUp } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Button } from './ui/button'
import type { GalleryPhoto } from '#/types/gallery'

interface CloudinaryBase {
  createUploadWidget: (
    options: Record<string, unknown>,
    callback: (error: unknown, result: unknown) => void,
  ) => {
    open: () => void
    close: () => void
    destroy: () => void
  }
}

declare global {
  interface Window {
    cloudinary: CloudinaryBase
  }
}

interface CloudinaryUploadWidgetProps {
  onUpload: [
    (galleryId: string, uploadInfo: GalleryPhoto) => Promise<void>,
    () => Promise<void>,
  ]
  galleryId: string
}

export const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  galleryId,
  onUpload,
}) => {
  const uploadWidgetRef = useRef<any>(null)
  const uploadButtonRef = useRef<HTMLButtonElement>(null)
  const IMAGE_FULL_SCREEN = 0
  const IMAGE_THUMB = 1

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Create upload widget
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: import.meta.env.VITE_PUBLIC_CLOUDINARY_CLOUD_NAME,
            uploadPreset: import.meta.env.VITE_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
            folder: galleryId,
            tags: [galleryId],
            maxFileSize: 5_242_880, // 5MB file size limit
          },
          (error: any, result: any) => {
            if (!error && result && result.event === 'success') {
              // console.log('--------- Cloudinary upload result', result.info)
              const { thumbnail_url, eager, public_id } = result.info

              const [addPhotoToGallery, invalidateQuery] = onUpload
              addPhotoToGallery?.(galleryId, {
                thumbnail_url: eager[IMAGE_THUMB].secure_url ?? thumbnail_url,
                secure_url: eager[IMAGE_FULL_SCREEN].secure_url,
                id: public_id,
              })
              invalidateQuery()
            }
          },
        )

        // Add click event to open widget
        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open()
          }
        }

        const buttonElement = uploadButtonRef.current
        buttonElement.addEventListener('click', handleUploadClick)

        // Cleanup
        return () => {
          buttonElement.removeEventListener('click', handleUploadClick)
        }
      }
    }

    initializeUploadWidget()
  }, []) //onUpload

  return (
    <Button
      ref={uploadButtonRef}
      id="upload_widget"
      className="bg-blue-500 text-white hover:bg-blue-600"
    >
      <FileUp data-icon="inline-start" /> Upload
    </Button>
  )
}
