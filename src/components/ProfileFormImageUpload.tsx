import { useCallback, useRef, useState } from 'react'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import type { User } from '#/types/user'
import { updateUserField } from '#/firebase/user'
import {
  destroyImage,
  uploadImage,
} from '#/cloudinary/cloudinary-server-functions'
import { Button } from './ui/button'
import { DeleteAvatarAlertDialog } from './DeleteAvatarAlertDialog'
import { Spinner } from './ui/spinner'
import { CircleUserRound, FileUp } from 'lucide-react'
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from './ui/empty'

export function ProfileFormImageUpload({
  user,
  onSave,
}: {
  user: User
  onSave: () => Promise<void>
}) {
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const handleOnFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)

    try {
      if (user.avatar?.id) {
        destroyImage({ data: { photo: user.avatar } })
      }

      const formData = new FormData()
      formData.append('file', file)
      const results = await uploadImage({ data: formData })
      console.log('--------- upload results', results)
      await updateUserField(user.id, 'avatar', results)
      await onSave()
    } finally {
      setUploadingAvatar(false)
    }
  }

  const imageInputRef = useRef<HTMLInputElement>(null)
  const handleUplaodClick = useCallback(
    () => imageInputRef.current?.click(),
    [],
  )

  return (
    <>
      <Field className="hidden">
        <FieldLabel htmlFor="picture">Avatar</FieldLabel>
        <Input
          id="picture"
          onChange={handleOnFileChange}
          type="file"
          accept="image/*"
          ref={imageInputRef}
        />
      </Field>

      {!!user.avatar && (
        <div>
          <img
            src={user.avatar?.secure_url}
            alt={user.displayName + '`s avatar'}
            className="aspect-video w-full object-cover"
          />
          <div className="flex flex-col sm:flex-row">
            <Button onClick={handleUplaodClick} className="grow">
              {!!uploadingAvatar ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <>
                  <FileUp data-icon="inline-start" /> Change
                </>
              )}
            </Button>
            <DeleteAvatarAlertDialog
              className="grow"
              avatar={user.avatar}
              userId={user.id}
              invalidateRouteData={onSave}
            />
          </div>
        </div>
      )}

      {!user.avatar && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CircleUserRound />
            </EmptyMedia>
            <EmptyTitle>Avatar not found</EmptyTitle>
          </EmptyHeader>
          <EmptyContent>
            <Button
              variant="default"
              size="sm"
              onClick={handleUplaodClick}
              className="w-48"
            >
              {!!uploadingAvatar ? (
                <>
                  <Spinner data-icon="inline-start" />
                </>
              ) : (
                <>
                  <FileUp data-icon="inline-start" /> Upload profile picture
                </>
              )}
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </>
  )
}
