import { updateGalleryField, type UpdateableFields } from '#/firebase/gallery'
import { useState } from 'react'
import { Field, FieldGroup, FieldLabel, FieldSet } from './ui/field'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { useDebouncer } from '@tanstack/react-pacer'
import type { Gallery } from '#/types/gallery'
import { SupportsMarkdown } from './SupportsMarkdown'

export function GalleryDetailsForm({
  gallery,
  onSave,
}: {
  gallery: Gallery
  onSave?: () => void
}) {
  const [formValues, setFormValues] = useState({
    title: gallery.title || '',
    description: gallery.description || '',
  })
  const debouncer = useDebouncer(
    (fieldName: UpdateableFields, fieldContent: string) => {
      updateGalleryField(gallery.id, fieldName, fieldContent)
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
    <FieldSet className="w-full">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            disabled={gallery.isApproved}
            placeholder="Gallery Title"
            onChange={(e) => handleOnChange('title', e.target.value)}
            value={formValues.title}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="description">Description</FieldLabel>
          <Textarea
            id="description"
            disabled={gallery.isApproved}
            placeholder="Gallery description..."
            rows={4}
            onChange={(e) => handleOnChange('description', e.target.value)}
            value={formValues.description}
          />
          <SupportsMarkdown />
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}
