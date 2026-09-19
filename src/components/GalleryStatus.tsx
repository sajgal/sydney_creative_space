import {
  approveGallery,
  publishGallery,
  unpublishGallery,
} from '#/firebase/gallery'
import { useState } from 'react'
import { Button } from './ui/button'
import { ChevronDownIcon, Rocket, Unplug, CircleCheck } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import dayjs from 'dayjs'
import { Field, FieldGroup, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import type { Gallery } from '#/types/gallery'
import { useAuth } from '#/auth'
import FullWidthSpinner from './FullWidthSpinner'
import { dateFormat, datetimeFormat, timeFormat } from '#/utils/dateFormat'

export function GalleryStatus({
  galleryData,
  invalidateRouteData,
}: {
  galleryData: Gallery
  invalidateRouteData: () => Promise<void>
}) {
  const { isSuperAdmin } = useAuth()
  const defaultTime = '09:00:00'
  const [isPublishingPending, setIsPublishingPending] = useState(false)
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(
    galleryData.publishDate ? new Date(galleryData.publishDate) : undefined,
  )

  const [time, setTime] = useState(
    galleryData.publishDate
      ? dayjs(galleryData.publishDate).format(timeFormat)
      : defaultTime,
  )

  const handlePublish = async () => {
    let publishDate

    if (date) {
      const formattedDate = dayjs(date).format('YYYY-MM-DD')
      publishDate = dayjs(`${formattedDate} ${time}`).valueOf()
    }

    setIsPublishingPending(true)

    try {
      await publishGallery(galleryData.id, date ? publishDate : undefined)
    } catch (error) {
      console.error('Error while publishing a gallery.', error)
    }

    await invalidateRouteData()
    setIsPublishingPending(false)
  }

  const handleUnpublish = async () => {
    setIsPublishingPending(true)

    try {
      await unpublishGallery(galleryData.id)
    } catch (error) {
      console.error('Error while publishing a gallery.', error)
    }

    setDate(undefined)
    setTime(defaultTime)
    await invalidateRouteData()
    setIsPublishingPending(false)
  }

  const handleApprove = async () => {
    setIsPublishingPending(true)
    try {
      await approveGallery(galleryData)
    } catch (error) {
      console.error('Error during gallery approval.', error)
    }
    await invalidateRouteData()
    setIsPublishingPending(false)
  }

  if (isPublishingPending) {
    return <FullWidthSpinner />
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {!galleryData.isWaitingForApproval && !galleryData.isApproved && (
        <>
          <FieldGroup className="mx-auto max-w-xs flex-row">
            <Field>
              <FieldLabel htmlFor="date-picker-optional">
                Publish Date
              </FieldLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    id="date-picker-optional"
                    className="w-32 justify-between font-normal"
                  >
                    {date ? dayjs(date).format(dateFormat) : 'ASAP'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    defaultMonth={date}
                    disabled={{ before: new Date() }}
                    onSelect={(date) => {
                      setDate(date)
                      setOpen(false)
                    }}
                  />
                </PopoverContent>
              </Popover>
            </Field>
            {!!date && (
              <>
                <Field className="w-48">
                  <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                  <Input
                    type="time"
                    id="time-picker-optional"
                    step="1"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                </Field>

                <Field className="w-48">
                  <FieldLabel> </FieldLabel>
                  <Button onClick={() => setDate(undefined)}>Clear</Button>
                </Field>
              </>
            )}
          </FieldGroup>
          <Button onClick={handlePublish}>
            <Rocket data-icon="inline-start" /> Publish
          </Button>
        </>
      )}

      {!!galleryData.isWaitingForApproval && (
        <>
          <div>
            Gallery is waiting for approval since{' '}
            {dayjs(galleryData.askedForApprovalDate).format(
              datetimeFormat,
            )}{' '}
          </div>
          <div>
            Publish date:{' '}
            {galleryData.publishDate
              ? dayjs(galleryData.publishDate).format(datetimeFormat)
              : 'ASAP'}
          </div>
        </>
      )}

      {!!galleryData.isApproved && (
        <div>
          <div>
            Gallery is approved since{' '}
            {dayjs(galleryData.originalApprovalDate).format(datetimeFormat)}
          </div>
          <div>
            Publish date:{' '}
            {dayjs(galleryData.publishDate).format(datetimeFormat)}
          </div>
        </div>
      )}

      {(galleryData.isWaitingForApproval || galleryData.isApproved) && (
        <Button variant="destructive" onClick={handleUnpublish}>
          <Unplug data-icon="inline-start" /> Unpublish
        </Button>
      )}

      {!!isSuperAdmin && !!galleryData.isWaitingForApproval && (
        <div className="flex w-full justify-center gap-4 border-2 border-dashed p-2">
          <Button
            variant="default"
            onClick={handleApprove}
            className="bg-lime-600 text-white hover:bg-lime-700"
          >
            <CircleCheck data-icon="inline-start" /> Approve
          </Button>
        </div>
      )}
    </div>
  )
}
