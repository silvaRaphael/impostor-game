import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"

import { db } from "@/lib/firebase"

export async function getDbData<T>(dbName: string, id: string) {
  try {
    const docRef = doc(db, dbName, id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) return null

    return docSnap.data() as T
  } catch (e) {
    throw e
  }
}

export async function insertDbData<T>(dbName: string, data: T, id: string) {
  try {
    const docRef = doc(db, dbName, id)
    await setDoc(docRef, data as any)
  } catch (e) {
    throw e
  }
}

export async function updateDbData<T>(dbName: string, data: T, id: string) {
  try {
    const docRef = doc(db, dbName, id)
    await updateDoc(docRef, data as any)
  } catch (e) {
    throw e
  }
}

export async function deleteDbData(dbName: string, id: string) {
  try {
    const docRef = doc(db, dbName, id)
    await deleteDoc(docRef)
  } catch (e) {
    throw e
  }
}
