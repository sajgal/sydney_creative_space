import { Trash2, Trash2Icon } from 'lucide-react'
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

import { deleteGallery } from '#/utils/handleDelete'
import { useState } from 'react'
import { Spinner } from './ui/spinner'

export function DeleteGalleryAlertDialog({
  galleryId,
  invalidateRouteData,
}: {
  galleryId: string
  invalidateRouteData: () => Promise<void>
}) {
  const [isPending, setIsPending] = useState(false)

  const handleDeleteGalleryClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()

    setIsPending(true)

    try {
      await deleteGallery(galleryId, invalidateRouteData)
    } catch (error) {
      console.error(error)
    }

    setIsPending(false)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Trash2 />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete gallery?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this gallery and all its images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteGalleryClick}
            disabled={isPending}
          >
            {!!isPending ? <Spinner data-icon="inline-start" /> : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
