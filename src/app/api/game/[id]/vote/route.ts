import { NextRequest, NextResponse } from "next/server"

import { getDbData, setDbData } from "@/lib/helpers/handle-db-data"
import { Game } from "../../route"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { to } = await req.json()
    const from = req.cookies.get("player")?.value
    const gameId = params.id

    if (!gameId) throw new Error("ID inválido!")
    if (!from) throw new Error("Jogador inválido!")
    if (!to) throw new Error("Voto inválido!")

    const games = await getDbData<Game[]>("games")

    const game = games.find((game) => game.id === gameId)

    if (!game) throw new Error("Jogo não encontrado!")

    const maxVotes = game.players.length

    const newGames = games.map((game) => {
      if (game.id === gameId) {
        let players = game.players

        return {
          ...game,
          words: game.words.map((word, i, { length }) => {
            if (i === length - 1) {
              const votes = [
                ...word.votes,
                {
                  from,
                  to
                }
              ]

              const done = maxVotes === votes.length

              if (done) {
                let wrongVotes = 0

                votes.forEach((vote) => {
                  const player = players.findIndex(
                    (item) => item.name === vote.from
                  )

                  if (player !== -1) {
                    if (word.impostor === vote.to) {
                      players[player].score = players[player].score + 1
                    } else if (word.impostor !== vote.from) {
                      wrongVotes++
                    }
                  }
                })

                const impostor = players.findIndex(
                  (item) => item.name === word.impostor
                )

                if (impostor !== -1) {
                  players[impostor].score = players[impostor].score + wrongVotes
                }
              }

              return {
                ...word,
                votes,
                done
              }
            }

            return word
          }),
          players
        }
      }

      return game
    }) as Game[]

    await setDbData<Game[]>("games", newGames)

    const data = game

    return NextResponse.json({ data })
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}
