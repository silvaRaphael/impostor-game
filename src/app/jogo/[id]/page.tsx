import { allFakers, fakerPT_BR } from "@faker-js/faker"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Wrapper, WrapperBody, WrapperHeader } from "@/components/wrapper"
import { Game } from "@/app/api/game/route"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { CreateNewWordForm } from "./create-new-word-form"
import { translator } from "@/lib/helpers/translator"

export default async function Page({ params }: { params: { id: string } }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/game/${params.id}`,
    { cache: "no-cache" }
  )

  const game = (await response.json()).data as Game

  //   const [, saveGame] = useLocalStorage<Game | undefined>("game", undefined)

  const word = fakerPT_BR.word.noun()
  console.log(`${fakerPT_BR}, ${word}`)
  translator(word).then(console.log)
  //   for (let key of Object.keys(allFakers)) {
  //     try {
  //       if (key.includes("pt"))
  //         console.log(`${key}, ${allFakers[key].word.noun()}`)
  //     } catch (e) {
  //       console.log(`In locale ${key}, an error occurred: ${e}`)
  //     }
  //   }

  return (
    <Wrapper>
      <WrapperHeader title={`Jogo #${game.id}`}>
        <Link href="/">
          <Button variant="outline" size="icon">
            <ChevronLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
      </WrapperHeader>

      <WrapperBody>
        <div className="flex flex-col gap-8 w-full">
          <div className="space-y-3">
            <p className="font-medium">Placar</p>

            <div className="flex flex-col items-center gap-3">
              {game.players
                .sort((a, b) => b.score - a.score)
                .map((player, i) => (
                  <div
                    key={i}
                    className="border rounded-lg flex w-full gap-3 px-4 py-2 justify-between"
                  >
                    <p className="font-semibold">{player.name}</p>
                    <p className="font-semibold">{player.score}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="font-medium">Últimas Palavras</p>

            <CreateNewWordForm game={game} />
          </div>
        </div>
      </WrapperBody>
    </Wrapper>
  )
}
