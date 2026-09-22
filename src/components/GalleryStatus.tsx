import {
  approveGallery,
  publishGallery,
  unpublishGallery,
} from '#/firebase/gallery'
import { useState } from 'react'
import { Button } from './ui/button'
import {
  ChevronDownIcon,
  Rocket,
  Unplug,
  CircleCheck,
  RotateCwFadingClock,
  CircleCheckBig,
} from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Calendar } from './ui/calendar'
import dayjs from 'dayjs'
import { FieldLabel } from './ui/field'
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
    <>
      {!galleryData.isWaitingForApproval && !galleryData.isApproved && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="flex min-w-max grow flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div className="grow">
              <FieldLabel htmlFor="date-picker-optional">
                Publishing Date
              </FieldLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild className="min-w-full justify-start">
                  <Button
                    variant="outline"
                    id="date-picker-optional"
                    className="font-normal"
                  >
                    {date ? dayjs(date).format(dateFormat) : 'ASAP'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="overflow-hidden p-0" align="start">
                  <Calendar
                    className="w-auto"
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
            </div>
            {!!date && (
              <div className="grow">
                <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                <Input
                  type="time"
                  id="time-picker-optional"
                  step="1"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
              </div>
            )}
            {!!date && (
              <Button variant="destructive" onClick={() => setDate(undefined)}>
                Clear
              </Button>
            )}
          </div>
          <Button
            onClick={handlePublish}
            className="sm:self-end"
            disabled={(galleryData.photos?.length || 0) < 1}
          >
            <Rocket data-icon="inline-start" /> Publish
          </Button>
        </div>
      )}

      {(galleryData.isWaitingForApproval || galleryData.isApproved) && (
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="bg-accent self-center rounded-lg p-2">
            {!!galleryData.isWaitingForApproval && <RotateCwFadingClock />}
            {!!galleryData.isApproved && <CircleCheckBig />}
          </div>
          <div className="grow text-center sm:text-left">
            {!!galleryData.isWaitingForApproval && (
              <div className="shimmer">
                Waiting for approval since{' '}
                <b>
                  {dayjs(galleryData.askedForApprovalDate).format(
                    datetimeFormat,
                  )}
                </b>
              </div>
            )}

            {!!galleryData.isApproved && (
              <div>
                Approved since{' '}
                <b>
                  {dayjs(galleryData.originalApprovalDate).format(
                    datetimeFormat,
                  )}
                </b>
              </div>
            )}

            <div>
              Publish date{' '}
              <b>
                {galleryData.publishDate
                  ? dayjs(galleryData.publishDate).format(datetimeFormat)
                  : 'ASAP'}
              </b>
            </div>
          </div>

          <div className="self-center">
            <Button variant="destructive" onClick={handleUnpublish}>
              <Unplug data-icon="inline-start" /> Unpublish
            </Button>
          </div>
        </div>
      )}

      {!!isSuperAdmin && !!galleryData.isWaitingForApproval && (
        <div className="mt-2 flex w-full justify-center gap-4 border-2 border-dashed p-2">
          <Button
            variant="default"
            onClick={handleApprove}
            className="bg-lime-600 text-white hover:bg-lime-700"
          >
            <CircleCheck data-icon="inline-start" /> Approve
          </Button>
        </div>
      )}
    </>
  )
}
