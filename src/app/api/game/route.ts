import { NextRequest, NextResponse } from "next/server"

import { getDbData, setDbData } from "@/lib/helpers/handle-db-data"

export type Player = {
  name: string
  score: number
}

export type Game = {
  id: string
  creator: string
  rounds: number
  players: Player[]
  words: {
    word: string
    impostor: string | null
    done: boolean
    votes: {
      from: string
      to: string
    }[]
  }[]
}

export async function POST(req: NextRequest) {
  try {
    const { gameId, rounds, player } = await req.json()

    if (!gameId) throw new Error("ID inválido!")
    if (!rounds) throw new Error("Nº de rodadas inválido!")
    if (!player) throw new Error("Nome inválido!")

    const games = await getDbData<Game[]>("games")

    let game = games.find((game) => game.id === gameId)

    if (game) throw new Error("Jogo já criado!")

    game = {
      id: gameId,
      creator: player,
      rounds,
      players: [
        {
          name: player,
          score: 0
        }
      ],
      words: []
    }

    const newGames = [...games, game]

    await setDbData<Game[]>("games", newGames)

    const data = game

    const response = NextResponse.json(
      { data },
      {
        headers: {
          "Set-Cookie": `player=${player}; Path=/;`
        }
      }
    )

    return response
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const gameId = url.searchParams.get("game") || ""

    if (!gameId) throw new Error("ID inválido!")

    const games = await getDbData<Game[]>("games")

    const game = games.find((game) => game.id === gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    const newGames = games.filter((item) => item.id !== gameId)

    await setDbData<Game[]>("games", newGames)

    const response = NextResponse.json({})

    response.cookies.set("player", "", { maxAge: 0 })

    return response
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
