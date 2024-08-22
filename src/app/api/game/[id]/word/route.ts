import { NextRequest, NextResponse } from "next/server"

import { getDbData, updateDbData } from "@/lib/helpers/handle-db-data"
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

    let game = await getDbData<Game>("games", gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    if (game.words.length === game.rounds)
      throw new Error("Rodadas finalizadas!")

    const word = getRandomItemFromList(
      availableWords,
      game.words.map((word) => word.word)
    )

    const impostor = getRandomItemFromList(
      game.players.map((player) => player.name),
      []
    )

    game = {
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

    await updateDbData<Game>("games", game, gameId)

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

    let game = await getDbData<Game>("games", gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    game = {
      ...game,
      words: game.words.filter((item) => item.word !== word)
    }

    await updateDbData<Game>("games", game, gameId)

    const data = game

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
