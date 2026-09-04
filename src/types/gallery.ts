export type Gallery = {
  id: string
  title?: string
  created?: number
  publishedAt?: number
  photos?: Array<GalleryPhoto>
  description?: string
}

export type GalleryPhoto = {
  secure_url: string
  thumbnail_url: string
  id: string
}
