import { NextRequest, NextResponse } from "next/server"

import { getDbData, setDbData } from "@/lib/helpers/handle-db-data"
import { Game } from "../route"
import { faker } from "@/lib/helpers/faker"
import { translator } from "@/lib/helpers/translator"

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id

    if (!gameId) throw new Error("ID inválido!")

    const games = await getDbData<Game[]>("games")

    const game = games.find((game) => game.id === gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    const data = game

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id

    if (!gameId) throw new Error("ID inválido!")

    const games = await getDbData<Game[]>("games")

    const game = games.find((game) => game.id === gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    const newGames = (await Promise.all(
      games.map(async (game) => {
        if (game.id === gameId) {
          const word = await translator(faker.word.verb())

          return {
            ...game,
            words: [
              ...game.words,
              {
                word,
                impostor: null
              }
            ]
          }
        }

        return game
      })
    )) as Game[]

    setDbData<Game[]>("games", newGames)

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
