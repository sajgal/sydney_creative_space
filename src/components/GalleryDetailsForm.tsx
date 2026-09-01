import { updateGalleryField, type UpdateableFields } from '#/firebase/gallery'
import { useState } from 'react'
import { Card, CardContent } from './ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from './ui/field'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useDebouncer } from '@tanstack/react-pacer'

export function GalleryDetailsForm({
  galleryData,
  onSave,
}: {
  galleryData: { galleryId: string; title?: string; description?: string }
  onSave?: () => void
}) {
  const [formValues, setFormValues] = useState({
    title: galleryData.title || '',
    description: galleryData.description || '',
  })
  const debouncer = useDebouncer(
    (fieldName: UpdateableFields, fieldContent: string) => {
      updateGalleryField(galleryData.galleryId, fieldName, fieldContent)
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
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="Gallery Title"
                onChange={(e) => handleOnChange('title', e.target.value)}
                value={formValues.title}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="Gallery description..."
                rows={4}
                onChange={(e) => handleOnChange('description', e.target.value)}
                value={formValues.description}
              />
              <FieldDescription>
                If not empty, gallery description will be shown at the top of
                the gallery.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldSet>
      </CardContent>
    </Card>
  )
}
