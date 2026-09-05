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
import { ArrowLeft, ArrowRight, X } from 'lucide-react'

type RenderProps = { photo: GalleryPhoto } & React.ComponentProps<'div'>

const Dialog = ({
  children,
  ...props
}: { children: React.ReactNode } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className="data-open:animate-in data-open:fade-in-0 fixed top-0 left-0 h-screen w-screen overflow-hidden bg-black/90 backdrop-blur-sm duration-200 supports-backdrop-filter:backdrop-blur-xs"
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
    <>
      <div>
        <Button
          className="fixed top-0 right-0 size-20 bg-transparent hover:bg-gray-800"
          // there is no need for handling click functionality here
          // click will propagate to the modal background and close the dialog
        >
          <X className="size-4" color="white" />
        </Button>
      </div>
      <div className="flex h-screen items-center">
        <Button
          className="mr-2 size-20 h-screen bg-transparent hover:bg-gray-800"
          onClick={handleLeftArrowClick}
        >
          <ArrowLeft className="size-5" color="white" />
        </Button>
        <div className="flex grow justify-center">{children}</div>
        <Button
          className="ml-2 size-20 h-screen bg-transparent hover:bg-gray-800"
          onClick={handleRightArrowClick}
        >
          <ArrowRight className="size-5" color="white" />
        </Button>
      </div>
    </>
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

  // disables scrolling when modal is visible
  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }, [isModalVisible])

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
        <Dialog
          onClick={() => handleCloseDialog()}
          {...(isModalVisible ? { 'data-open': true } : {})}
        >
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
