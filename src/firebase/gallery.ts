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
} from 'firebase/firestore'
import { db } from '@/firebase/config'

const COLLECTION_NAME_GALLERY = 'gallery'
const col = collection(db, COLLECTION_NAME_GALLERY)

export const getUserGalleries = async (userId: string) => {
  const q = query(
    col,
    where('userId', '==', userId),
    orderBy('created', 'desc'),
  )
  // const q = query(col, where('userId', '==', userId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs
}

export const addGallery = async (userId: string) => {
  const docRef = await addDoc(col, { userId, created: Date.now() })

  return docRef.id
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

export const getGalleryById = async (userId: string, galleryId: string) => {
  const docRef = doc(db, COLLECTION_NAME_GALLERY, galleryId)
  const docSnap = await getDoc(docRef)
  const data = docSnap.data()

  if (data?.userId !== userId) {
    throw new Error('Unauthorized: userId mismatch')
  }

  return data
}
