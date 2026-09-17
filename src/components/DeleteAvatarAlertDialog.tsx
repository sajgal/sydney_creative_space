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

import { useState } from 'react'
import { Spinner } from './ui/spinner'
import { destroyImage } from '#/cloudinary/cloudinary-server-functions'
import type { GalleryPhoto } from '#/types/gallery'
import { deleteUserField } from '#/firebase/user'

export function DeleteAvatarAlertDialog({
  avatar,
  userId,
  invalidateRouteData,
  className,
}: {
  avatar: GalleryPhoto
  userId: string
  invalidateRouteData: () => Promise<void>
  className?: string
}) {
  const [isPending, setIsPending] = useState(false)

  const handleDeleteAvatarClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault()

    setIsPending(true)

    try {
      await destroyImage({ data: { photo: avatar } })
      await deleteUserField(userId, 'avatar')
      await invalidateRouteData()
    } catch (error) {
      console.error(error)
    }

    setIsPending(false)
  }

  return (
    <AlertDialog key={avatar.id}>
      <AlertDialogTrigger asChild>
        <Button
          className={className || ''}
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          <Trash2 /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete Avatar?</AlertDialogTitle>
          <AlertDialogDescription>
            Beware, this will permanently delete your profile picture.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDeleteAvatarClick}
            disabled={isPending}
          >
            {!!isPending ? <Spinner data-icon="inline-start" /> : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
