import { addDoc, collection, getDocs, query, where } from 'firebase/firestore'
import type { QueryDocumentSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'

const COLLECTION_NAME_GALLERY = 'gallery'
const doc = collection(db, COLLECTION_NAME_GALLERY)

export const getUserGalleries = async (
  userId: string,
): Promise<Array<QueryDocumentSnapshot>> => {
  const q = query(doc, where('userId', '==', userId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs
}

export const addGallery = async ( userId: string): Promise<string> => {
  const docRef = await addDoc(doc, { userId })

  return docRef.id;
}