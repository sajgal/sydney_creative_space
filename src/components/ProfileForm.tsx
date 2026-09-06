import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Field, FieldGroup, FieldLabel, FieldSet } from './ui/field'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useDebouncer } from '@tanstack/react-pacer'
import type { User } from '#/types/user'
import { updateUserField, type UpdateableFields } from '#/firebase/user'

export function ProfileForm({
  userData,
  onSave,
}: {
  userData: User
  onSave?: () => void
}) {
  const [formValues, setFormValues] = useState({
    displayName: userData.displayName || '',
    bio: userData.bio || '',
  })
  const debouncer = useDebouncer(
    (fieldName: UpdateableFields, fieldContent: string) => {
      updateUserField(userData.id, fieldName, fieldContent)
      !!onSave && onSave()
    },
    { wait: 800 },
  )

  const handleOnChange = (
    fieldName: UpdateableFields,
    fieldContent: string,
  ) => {
    debouncer.maybeExecute(fieldName, fieldContent)
    setFormValues({ ...formValues, [fieldName]: fieldContent })
  }

  return (
    <Card className="mt-2 mb-5 w-full">
      <CardContent>
        <FieldSet className="w-full">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
              <Input
                id="displayName"
                placeholder="Leica Man"
                onChange={(e) => handleOnChange('displayName', e.target.value)}
                value={formValues.displayName}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="bio">Bio</FieldLabel>
              <Textarea
                id="bio"
                placeholder="I started shooting when I was 5 years old..."
                rows={4}
                onChange={(e) => handleOnChange('bio', e.target.value)}
                value={formValues.bio}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
