export type Gallery = {
  id: string
  title?: string
  created?: number
  photos?: Array<GalleryPhoto>
}

export type GalleryPhoto = {
  secure_url: string
  thumbnail_url: string
  id: string
}
