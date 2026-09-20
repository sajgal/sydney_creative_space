import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  collection,
  getDocs,
  documentId,
  deleteField,
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { User } from '#/types/user'
import type { GalleryPhoto } from '#/types/gallery'
import { getPublishedGalleriesWithoutUserData } from './gallery'

export type UpdateableFields = 'bio' | 'displayName' | 'avatar'

const COLLECTION_NAME_USER = 'user'
const col = collection(db, COLLECTION_NAME_USER)

export const getUserData = async (userId: string) => {
  const docRef = doc(db, COLLECTION_NAME_USER, userId)
  const docSnap = await getDoc(docRef)

  return docSnap.exists()
    ? ({
        id: docSnap.id,
        ...docSnap.data(),
      } as User)
    : undefined
}

export const getUsersInArray = async (userIds: Array<string>) => {
  const q = query(col, where(documentId(), 'in', userIds))
  const querySnapshot = await getDocs(q)
  const userMap = new Map<string, User>()

  querySnapshot.docs.forEach((user) => {
    userMap.set(user.id, { id: user.id, ...user.data() })
  })

  return userMap
}

export const getPublishedUsers = async () => {
  const { uniqueUserIds } = await getPublishedGalleriesWithoutUserData()

  if (uniqueUserIds.length === 0) return []

  const users = await getUsersInArray(uniqueUserIds)

  return [...users.values()]
}

export const addUser = async (userId: string) => {
  const docRef = doc(db, COLLECTION_NAME_USER, userId)
  await setDoc(docRef, { created: Date.now() })

  return { id: userId }
}

export const updateUserField = async (
  userId: string,
  fieldName: UpdateableFields,
  fieldContent: string | GalleryPhoto,
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

export const deleteUserField = async (
  userId: string,
  fieldName: UpdateableFields,
) => {
  const docRef = doc(db, COLLECTION_NAME_USER, userId)

  return await updateDoc(docRef, {
    [fieldName]: deleteField(),
  })
}
