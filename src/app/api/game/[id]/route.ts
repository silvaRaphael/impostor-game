import { NextRequest, NextResponse } from "next/server"

import { getDbData, setDbData } from "@/lib/helpers/handle-db-data"
import { Game } from "../route"

export async function GET(
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

    const data = game

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const { player } = await req.json()

    if (!gameId) throw new Error("ID inválido!")
    if (!player) throw new Error("Nome inválido!")

    const games = await getDbData<Game[]>("games")

    const game = games.find((game) => game.id === gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    const playerInUse = game.players.find((item) => item.name === player)
    if (!playerInUse) {
      const newGames = games.map((game) => {
        if (game.id === gameId) {
          return {
            ...game,
            players: [
              ...game.players,
              {
                name: player,
                score: 0
              }
            ]
          }
        }

        return game
      })

      await setDbData<Game[]>("games", newGames)
    }

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gameId = params.id
    const url = new URL(req.url)
    const player = url.searchParams.get("player") || ""

    if (!gameId) throw new Error("ID inválido!")
    if (!player) throw new Error("Jogador inválido!")

    const games = await getDbData<Game[]>("games")

    const game = games.find((game) => game.id === gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    const newGames = games.map((game) => {
      if (game.id === gameId) {
        return {
          ...game,
          players: game.players.filter((item) => item.name !== player)
        }
      }

      return game
    })

    await setDbData<Game[]>("games", newGames)

    const data = game

    const response = NextResponse.json({ data })

    response.cookies.set("player", "", { maxAge: 0 })

    return response
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
