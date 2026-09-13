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
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { getServerTime } from '#/utils/server-functions'
import type { Gallery, GalleryPhoto } from '#/types/gallery'
import { getUsersInArray } from './user'

export type UpdateableFields = 'title' | 'description' | 'photos'

const COLLECTION_NAME_GALLERY = 'gallery'
const col = collection(db, COLLECTION_NAME_GALLERY)

export const getUserGalleries = async (userId: string) => {
  const q = query(
    col,
    where('userId', '==', userId),
    orderBy('created', 'desc'),
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs
}

export const getPublishedGalleries = async (
  userId?: string,
): Promise<Array<Gallery>> => {
  const now = await getServerTime()

  const constraints: QueryConstraint[] = [
    where('publishedAt', '<=', now),
    orderBy('publishedAt', 'desc'),
  ]

  if(userId) {
    constraints.push(
      where('userId', '==', userId)
    )
  }

  const q = query(
    col,
    ...constraints
  )

  const galleries = await getDocs(q)
  const uniqueUserIds = [...new Set(galleries.docs.map((g) => g.data().userId))]
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
  const docRef = await addDoc(col, { userId, created: Date.now() })

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

export const getGalleryById = async (galleryId: string) => {
  const docRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)
  const docSnap = await getDoc(docRef)
  return docSnap.data()
}

export const getUserGalleryById = async (userId: string, galleryId: string) => {
  const docRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)
  const docSnap = await getDoc(docRef)
  const data = docSnap.data()

  if (data?.userId !== userId) {
    throw new Error('Unauthorized: userId mismatch')
  }

  return data
}

export const publishGallery = async (galleryId: string) => {
  const galleryRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)

  try {
    const serverTime = await getServerTime()
    await updateDoc(galleryRef, {
      publishedAt: serverTime,
    })
  } catch (error) {
    console.error('Error publishing gallery', error)
  }
}

export const unpublishGallery = async (galleryId: string) => {
  const galleryRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)

  try {
    await updateDoc(galleryRef, {
      publishedAt: deleteField(),
    })
  } catch (error) {
    console.error('Error unpublishing gallery', error)
  }
}

export const updateGalleryField = async (
  galleryId: string,
  fieldName: UpdateableFields,
  fieldContent: string | Array<GalleryPhoto>,
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
