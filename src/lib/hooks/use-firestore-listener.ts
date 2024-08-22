import { useEffect } from "react"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { doc, onSnapshot } from "firebase/firestore"

import { queryClient } from "@/components/providers"
import { db } from "../firebase"
import { Game } from "@/app/api/game/route"

export const useFirestoreListener = (
  queryKey: QueryKey,
  dbName: string,
  docId: string
) => {
  useEffect(() => {
    const docRef = doc(db, dbName, docId)

    const unsubscribe = onSnapshot(
      docRef,
      (_) => {
        queryClient.invalidateQueries({
          queryKey
        })
      },
      (error) => {
        console.log("Error listening to Firestore document:", error)
        location.reload()
      }
    )

    return () => unsubscribe()
  }, [docId, queryClient, queryKey])
}

export const useGameData = (queryKey: QueryKey, dbName: string, id: string) => {
  const query = useQuery({
    queryKey: ["game", id],
    queryFn: async () => {
      const response = await fetch(`/api/game/${id}`, {
        method: "GET",
        cache: "no-store",
        credentials: "include"
      })

      const game = (await response.json()).data as Game

      return game
    }
  })

  useFirestoreListener(queryKey, dbName, id)

  return query
}
