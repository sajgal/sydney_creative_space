import type { User } from './user'

export type Gallery = {
  id: string
  title?: string
  createdDate?: number
  publishDate?: number
  askedForApprovalDate?: number
  originalApprovalDate?: number
  isWaitingForApproval?: boolean
  isApproved?: boolean
  photos?: Array<GalleryPhoto>
  description?: string
  userId: string
  userData?: User
}

export type GalleryPhoto = {
  secure_url: string
  thumbnail_url: string
  id: string
}