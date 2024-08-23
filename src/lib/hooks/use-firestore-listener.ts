import { useEffect } from "react"
import { QueryKey, useQuery } from "@tanstack/react-query"
import { doc, onSnapshot } from "firebase/firestore"

import { queryClient } from "@/components/providers"
import { db } from "../firebase"
import { Game } from "@/app/api/game/route"
import { compareArraysByProps } from "../helpers/compare-arrays"

const props = {
  id: [],
  creator: [],
  rounds: [],
  players: {
    name: [],
    score: []
  },
  words: {
    word: [],
    done: [],
    impostor: [],
    votes: {
      from: [],
      to: []
    }
  }
}

const sortKeys = {
  main: "id",
  players: "name",
  words: "word",
  votes: "from"
}

export const useFirestoreListener = (
  queryKey: QueryKey,
  dbName: string,
  docId: string
) => {
  useEffect(() => {
    const docRef = doc(db, dbName, docId)

    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        const savedGame = queryClient.getQueryData(queryKey) as Game | undefined

        if (docSnap.exists()) {
          const game = docSnap.data() as Game

          if (
            !savedGame ||
            (savedGame &&
              !compareArraysByProps([game], [savedGame], props, sortKeys))
          ) {
            queryClient.invalidateQueries({
              queryKey
            })
          }
        } else {
          if (
            !savedGame ||
            (savedGame &&
              !compareArraysByProps([], [savedGame], props, sortKeys))
          ) {
            queryClient.invalidateQueries({
              queryKey
            })
          }
        }
      },
      (error) => {
        console.log("Error listening to Firestore document:", error)
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
