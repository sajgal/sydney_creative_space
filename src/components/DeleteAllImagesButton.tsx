import { Trash2Icon } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

import { deleteAllGalleryPhotos } from '#/utils/handleDelete'
import { useState } from 'react'
import { Spinner } from './ui/spinner'

export function DeleteAllImagesButton({
  galleryId,
  invalidateRouteData,
  ...props
}: React.ComponentProps<'div'> & {
  galleryId: string
  invalidateRouteData: () => Promise<void>
}) {
  const [isPending, setIsPending] = useState(false)

  const handleDeleteAll = async () => {
    setIsPending(true)

    try {
      await deleteAllGalleryPhotos(galleryId)
    } catch (error) {
      console.error('Error while deleting images from gallery', error)
    }

    await invalidateRouteData()
    setIsPending(false)
  }

  return (
    <div {...props}>
      <AlertDialog key={galleryId}>
        <AlertDialogTrigger
          asChild
          className="animate-in slide-in-from-top w-full duration-200"
        >
          <Button variant="destructive" disabled={isPending}>
            {!!isPending ? (
              <Spinner data-icon="inline-start" />
            ) : (
              'Delete all photos'
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <Trash2Icon />
            </AlertDialogMedia>
            <AlertDialogTitle>Whoa! Delete all images?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all the images in this gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={isPending}
            >
              {!!isPending ? <Spinner data-icon="inline-start" /> : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
