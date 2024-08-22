import { NextRequest, NextResponse } from "next/server"

import { getDbData, setDbData } from "@/lib/helpers/handle-db-data"
import { Game } from "../../route"
import { availableWords } from "@/lib/words"
import { getRandomItemFromList } from "@/lib/helpers/get-random-item-from-list"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const player = req.cookies.get("player")?.value

    if (!gameId) throw new Error("ID inválido!")
    if (!player) throw new Error("Jogador inválido!")

    const games = await getDbData<Game[]>("games")

    const game = games.find((game) => game.id === gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    if (game.words.length === game.rounds)
      throw new Error("Rodadas finalizadas!")

    const newGames = (await Promise.all(
      games.map(async (game) => {
        if (game.id === gameId) {
          const word = getRandomItemFromList(
            availableWords,
            game.words.map((word) => word.word)
          )

          const impostor = getRandomItemFromList(
            game.players.map((player) => player.name),
            []
          )

          return {
            ...game,
            words: [
              ...game.words,
              {
                word,
                impostor,
                done: false,
                votes: []
              }
            ]
          }
        }

        return game
      })
    )) as Game[]

    await setDbData<Game[]>("games", newGames)

    const data = game

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const url = new URL(req.url)
    const word = url.searchParams.get("word") || ""

    if (!gameId) throw new Error("ID inválido!")
    if (!word) throw new Error("Palavra inválida!")

    const games = await getDbData<Game[]>("games")

    const game = games.find((game) => game.id === gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    const newGames = games.map((game) => {
      if (game.id === gameId) {
        return {
          ...game,
          words: game.words.filter((item) => item.word !== word)
        }
      }

      return game
    })

    setDbData<Game[]>("games", newGames)

    const data = game

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
