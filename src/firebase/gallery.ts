import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  getDoc,
  arrayRemove,
  deleteField,
  deleteDoc,
  QueryConstraint,
  FieldValue,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { getServerTime } from '#/utils/server-functions'
import type { Gallery, GalleryPhoto } from '#/types/gallery'
import { getUserData, getUsersInArray } from './user'

export type UpdateableFields = keyof Gallery
type ApprovalUpdates = {
  originalApprovalDate?: number
  askedForApprovalDate?: number | FieldValue
  isApproved: boolean
  isWaitingForApproval: FieldValue
  publishDate?: number
}

const COLLECTION_NAME_GALLERY = 'gallery'
const col = collection(db, COLLECTION_NAME_GALLERY)

export const getUserGalleries = async (userId: string) => {
  const q = query(
    col,
    where('userId', '==', userId),
    orderBy('createdDate', 'desc'),
  )

  const galleries = await getDocs(q)

  return galleries.docs.map((gallery) => {
    return { id: gallery.id, ...gallery.data() } as Gallery
  })
}

export const getPublishedGalleries = async (
  userId?: string,
): Promise<Array<Gallery>> => {
  const now = await getServerTime()

  const constraints: QueryConstraint[] = [
    where('publishDate', '<=', now),
    where('isApproved', '==', true),
    orderBy('originalApprovalDate', 'desc'),
  ]

  if (userId) {
    constraints.push(where('userId', '==', userId))
  }

  const q = query(col, ...constraints)

  const galleries = await getDocs(q)
  const uniqueUserIds = [...new Set(galleries.docs.map((g) => g.data().userId))]

  if (uniqueUserIds.length === 0) return []

  const userMap = await getUsersInArray(uniqueUserIds)

  return galleries.docs.map((gallery) => {
    const galleryData = { id: gallery.id, ...gallery.data() } as Gallery

    return {
      ...galleryData,
      userData: userMap.get(galleryData.userId),
    }
  })
}

export const addGallery = async (userId: string) => {
  const docRef = await addDoc(col, { userId, createdDate: Date.now() })

  return docRef.id
}

export const deleteGallery = async (galleryId: string) => {
  return await deleteDoc(doc(db, COLLECTION_NAME_GALLERY, galleryId))
}

export const addPhotoToGallery = async (
  galleryId: string,
  uploadInfo: { thumbnail_url: string; secure_url: string },
) => {
  const gallery = doc(db, COLLECTION_NAME_GALLERY, galleryId)

  await updateDoc(gallery, {
    photos: arrayUnion(uploadInfo),
  })
}

export const removePhotoFromGallery = async (
  galleryId: string,
  uploadInfo: { thumbnail_url: string; secure_url: string },
) => {
  const gallery = doc(db, COLLECTION_NAME_GALLERY, galleryId)

  await updateDoc(gallery, {
    photos: arrayRemove(uploadInfo),
  })
}

export const removeAllPhotosFromGallery = async (galleryId: string) => {
  const gallery = doc(db, COLLECTION_NAME_GALLERY, galleryId)

  await updateDoc(gallery, {
    photos: deleteField(),
  })
}

export const getGalleryById = async (galleryId: string): Promise<Gallery> => {
  const docRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)
  const docSnap = await getDoc(docRef)
  const galleryData = docSnap.data() as Gallery
  const userData = await getUserData(galleryData.userId)

  return {
    ...galleryData,
    userData,
  }
}

export const getUserGalleryById = async (
  userId: string,
  galleryId: string,
  isSuperAdmin: boolean,
) => {
  const docRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)
  const docSnap = await getDoc(docRef)
  const gallery = docSnap.data()

  if (gallery?.userId !== userId && !isSuperAdmin) {
    throw new Error('Unauthorized: userId mismatch')
  }

  return { id: docSnap.id, ...gallery } as Gallery
}

export const updateGalleryField = async (
  galleryId: string,
  fieldName: UpdateableFields,
  fieldContent: string | number | Array<GalleryPhoto>,
) => {
  const galleryRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)

  try {
    await updateDoc(galleryRef, {
      [fieldName]: fieldContent,
    })
  } catch (error) {
    console.error(`Firestore: Error updating ${fieldName} field`, error)
  }
}

export const getGalleriesThatAreWaitingForApproval = async (): Promise<
  Array<Gallery>
> => {
  const galleries = await getDocs(
    query(col, where('isWaitingForApproval', '==', true)),
  )
  const uniqueUserIds = [...new Set(galleries.docs.map((g) => g.data().userId))]

  if (uniqueUserIds.length === 0) return []

  const userMap = await getUsersInArray(uniqueUserIds)

  return galleries.docs.map((gallery) => {
    const galleryData = { id: gallery.id, ...gallery.data() } as Gallery

    return {
      ...galleryData,
      userData: userMap.get(galleryData.userId),
    }
  })
}

export const approveGallery = async (gallery: Gallery) => {
  const now = await getServerTime()
  const galleryRef = doc(db, COLLECTION_NAME_GALLERY, gallery.id)
  const updates: ApprovalUpdates = {
    isApproved: true,
    isWaitingForApproval: deleteField(),
    askedForApprovalDate: deleteField(),
  }

  // if we're approving the gallery for the first time,
  // set the originalApprovalDate
  if (!gallery.originalApprovalDate) {
    updates.originalApprovalDate = now
  }

  // if we want to publish the gallery ASAP,
  // the publishDate is undefined up until the approval
  if (!gallery.publishDate) {
    updates.publishDate = now
  }

  return await updateDoc(galleryRef, updates)
}

export const publishGallery = async (
  galleryId: string,
  publishDate?: number,
) => {
  const galleryRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)

  try {
    const serverTime = await getServerTime()
    await updateDoc(galleryRef, {
      publishDate: publishDate ? publishDate : deleteField(),
      askedForApprovalDate: serverTime,
      isWaitingForApproval: true,
    })
  } catch (error) {
    console.error('Error publishing gallery', error)
  }
}

export const unpublishGallery = async (galleryId: string) => {
  const galleryRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)

  try {
    await updateDoc(galleryRef, {
      publishDate: deleteField(),
      isWaitingForApproval: deleteField(),
      askedForApprovalDate: deleteField(),
      isApproved: deleteField(),
    })
  } catch (error) {
    console.error('Error unpublishing gallery', error)
  }
}
