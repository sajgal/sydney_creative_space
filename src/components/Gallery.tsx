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
    <div className="grid h-screen grid-cols-2 grid-rows-[auto_1fr_auto] md:grid-cols-[auto_1fr_auto] md:grid-rows-[auto_1fr]">
      <div className="order-1 col-start-1 col-end-3 row-start-1 row-end-2 flex justify-end md:order-1 md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2">
        <Button className="flex w-full justify-end bg-transparent hover:bg-gray-800">
          {/* there is no need for handling click functionality of close button */}
          {/* click will propagate and close the dialog */}
          <X className="size-5" color="white" />
        </Button>
      </div>
      <div className="order-3 col-start-1 col-end-2 row-start-3 row-end-4 flex items-center justify-center md:order-2 md:col-start-1 md:col-end-2 md:row-start-2 md:row-end-3">
        <Button
          onClick={handleLeftArrowClick}
          className="w-full bg-transparent hover:bg-gray-800 md:h-full"
        >
          <ArrowLeft className="size-7" color="white" />
        </Button>
      </div>
      <div className="order-2 col-start-1 col-end-3 row-start-2 row-end-3 min-h-0 md:order-3 md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-3">
        {children}
      </div>
      <div className="order-3 col-start-2 col-end-3 row-start-3 row-end-4 flex items-center justify-center md:order-4 md:col-start-3 md:col-end-4 md:row-start-2 md:row-end-3">
        <Button
          onClick={handleRightArrowClick}
          className="w-full bg-transparent hover:bg-gray-800 md:h-full"
        >
          <ArrowRight className="size-7" color="white" />
        </Button>
      </div>
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

  useHotkey('Space', () => {
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
              className="h-full w-full object-contain"
              src={activePhoto.secure_url}
              alt="gallery picture"
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
