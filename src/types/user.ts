import type { GalleryPhoto } from './gallery'

export type User = {
  id: string
  bio?: string
  displayName?: string
  avatar?: GalleryPhoto
}
