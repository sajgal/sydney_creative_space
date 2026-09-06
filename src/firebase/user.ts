import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { User } from '#/types/user'

export type UpdateableFields = 'bio' | 'displayName'

const COLLECTION_NAME_USER = 'user'

export const getUserData = async (userId: string) => {
  const docRef = doc(db, COLLECTION_NAME_USER, userId)
  const docSnap = await getDoc(docRef)

  return docSnap.exists()
    ? {
        id: docSnap.id,
        ...docSnap.data(),
      } as User
    : undefined
}

export const addUser = async (userId: string) => {
  const docRef = doc(db, COLLECTION_NAME_USER, userId)
  await setDoc(docRef, { created: Date.now() })

  return { id: userId }
}

export const updateUserField = async (
  userId: string,
  fieldName: UpdateableFields,
  fieldContent: string,
) => {
  const docRef = doc(db, COLLECTION_NAME_USER, userId)

  try {
    await updateDoc(docRef, {
      [fieldName]: fieldContent,
    })
  } catch (error) {
    console.error(`Firestore: Error updating ${fieldName} field`, error)
  }
}
