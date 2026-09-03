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
import { Button } from './ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type RenderProps = { photo: GalleryPhoto } & React.ComponentProps<'div'>

const Dialog = ({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className="absolute top-0 left-0 h-screen w-screen overflow-hidden bg-white/30 backdrop-blur-sm"
    >
      {children}
    </div>
  )
}

const DialogContent = ({
  children,
  handleLeftArrowClick,
  handleRightArrowClick,
}: {
  children: React.ReactNode
  handleRightArrowClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  handleLeftArrowClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}) => {
  return (
    <div className="flex h-screen items-center">
      <Button className="mr-2" onClick={handleLeftArrowClick}>
        <ArrowLeft />
      </Button>
      <div className="flex grow justify-center">{children}</div>
      <Button className="ml-2" onClick={handleRightArrowClick}>
        <ArrowRight />
      </Button>
    </div>
  )
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

  const handleLeftArrowClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setActivePhotoWithinRange(photos.indexOf(activePhoto) - 1)
  }

  const handleRightArrowClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation()
    setActivePhotoWithinRange(photos.indexOf(activePhoto) + 1)
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
          <DialogContent
            handleLeftArrowClick={handleLeftArrowClick}
            handleRightArrowClick={handleRightArrowClick}
          >
            <img
              className="max-h-screen object-contain"
              src={activePhoto.secure_url}
              alt="gallery picture"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
