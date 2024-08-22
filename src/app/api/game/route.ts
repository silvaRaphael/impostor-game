import { NextRequest, NextResponse } from "next/server"

import { getDbData } from "@/lib/helpers/handle-db-data"

export type Game = {
  id: string
  creator: string
  players: {
    name: string
    score: number
  }[]
  words: {
    word: string
    impostor: string | null
  }[]
}

export async function POST(req: NextRequest) {
  try {
    const { gameId } = await req.json()

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
