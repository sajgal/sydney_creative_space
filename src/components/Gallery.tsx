import type { GalleryPhoto } from '#/types/gallery'
import { useHotkey } from '@tanstack/react-hotkeys'
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react'

type RenderProps = { photo: GalleryPhoto } & React.ComponentProps<'div'>

const Dialog = ({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className="absolute top-0 left-0 min-h-screen min-w-screen bg-white/30 backdrop-blur-sm"
    >
      {children}
    </div>
  )
}

const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export function Gallery({
  children,
  ...props
}: React.ComponentProps<'div'> & {
  children: ReactElement<RenderProps> | Array<ReactElement<RenderProps>>
}) {
  const photos: Array<GalleryPhoto> = []
  const childrenWithClick: Array<ReactNode> = []
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [activePhoto, setActivePhoto] = useState({} as GalleryPhoto)

  const getIndexWithinRange = (index: number) => {
    const max = photos.length
    return ((index % max) + max) % max
  }

  const setActivePhotoWithinRange = (index: number) => {
    const newPhotoIndex = getIndexWithinRange(index)
    setActivePhoto(photos[newPhotoIndex])
  }

  const preloadPhotoWithIndex = (index: number) => {
    const img = new Image()
    img.src = photos[getIndexWithinRange(index)].secure_url
  }

  useHotkey('ArrowRight', () => {
    setActivePhotoWithinRange(photos.indexOf(activePhoto) + 1)
  })

  useHotkey('ArrowLeft', () => {
    setActivePhotoWithinRange(photos.indexOf(activePhoto) - 1)
  })

  useHotkey('Escape', () => {
    setIsModalVisible(false)
  })

  useEffect(() => {
    // preloading first photo while no photo is active
    if (photos.indexOf(activePhoto) === -1) {
      preloadPhotoWithIndex(0)
    }

    // when modal is open, preload next photo
    // I'm not preloading the previous photo for now.
    if (isModalVisible) {
      preloadPhotoWithIndex(photos.indexOf(activePhoto) + 1)
    }
  }, [isModalVisible, activePhoto])

  const handleGalleryListPhotoClick = (photo: GalleryPhoto) => {
    setActivePhoto(photo)
    setIsModalVisible(true)
  }

  const handleCloseDialog = () => {
    setIsModalVisible(false)
  }

  Children.forEach(children, (child) => {
    if (isValidElement(child)) {
      const clonedChild = cloneElement(child, {
        onClick: () => handleGalleryListPhotoClick(child.props.photo),
      })

      childrenWithClick.push(clonedChild)
      photos.push(child.props.photo)
    }
  })

  return (
    <div {...props}>
      {childrenWithClick}

      {isModalVisible && (
        <Dialog onClick={() => handleCloseDialog()}>
          <DialogContent>
            <img
              src={activePhoto.secure_url}
              loading="lazy"
              alt="gallery picture"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
