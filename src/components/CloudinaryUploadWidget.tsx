import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    cloudinary: CloudinaryBase;
  }
}

interface CloudinaryUploadWidgetProps {
 onUpload?: (publicId: string) => void;
 testingFolder: string,
}

export const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({ testingFolder }) => {
  const uploadWidgetRef = useRef<any>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const initializeUploadWidget = () => {
      if (window.cloudinary && uploadButtonRef.current) {
        // Create upload widget
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          {
	          cloudName: "dqjl6uv1s", //"your_cloud_name",
	          uploadPreset: "matejs-gallery", //"upload_preset_id"
            folder: testingFolder,
          },
          (error: any, result: any) => {
            if (!error && result && result.event === 'success') {
              console.log('Upload successful:', result.info);
              // onUpload?.(result.info.public_id);
            }
          }
        );

        // Add click event to open widget
        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        const buttonElement = uploadButtonRef.current;
        buttonElement.addEventListener('click', handleUploadClick);

        // Cleanup
        return () => {
          buttonElement.removeEventListener('click', handleUploadClick);
        };
      }
    };

    initializeUploadWidget();
  }, []); //onUpload

  return (
    <button
      ref={uploadButtonRef}
      id="upload_widget"
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Upload
    </button>
  );
};
