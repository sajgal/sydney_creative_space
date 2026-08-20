import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '@/firebase/config'

const COLLECTION_NAME_GALLERY = 'gallery'
const col = collection(db, COLLECTION_NAME_GALLERY)

export const getUserGalleries = async (userId: string) => {
  const q = query(col, where('userId', '==', userId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs
}

export const addGallery = async (userId: string) => {
  const docRef = await addDoc(col, { userId })

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
