import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    cloudinary: CloudinaryBase
  }
}

interface CloudinaryUploadWidgetProps {
  onUpload?: (
    galleryId: string,
    uploadInfo: { thumbnail_url: string; secure_url: string },
  ) => Promise<void>
  galleryId: string
}

export const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  galleryId,
  onUpload,
}) => {
  const uploadWidgetRef = useRef<any>(null)
  const uploadButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Create upload widget
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          {
            cloudName: 'dqjl6uv1s', //"your_cloud_name",
            uploadPreset: 'matejs-gallery', //"upload_preset_id"
            folder: galleryId,
          },
          (error: any, result: any) => {
            if (!error && result && result.event === 'success') {
              console.log('-------- result.info', result.info);
              const { thumbnail_url, secure_url } = result.info
              onUpload?.(galleryId, { thumbnail_url, secure_url })
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
    <button
      ref={uploadButtonRef}
      id="upload_widget"
      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Upload
    </button>
  )
}
