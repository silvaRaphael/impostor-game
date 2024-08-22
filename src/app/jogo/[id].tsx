import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Wrapper, WrapperBody, WrapperHeader } from "@/components/wrapper"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { Game } from "../../../pages-/api/game/[[...id]]"
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next"

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          id: "D6S53"
        }
      } // See the "paths" section below
    ],
    fallback: true // false or "blocking"
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  console.log(context)
  const params = {
    id: "D6S53"
  }
  const response = await fetch("/api/game", {
    method: "POST",
    body: JSON.stringify({ gameId: params.id }),
    cache: "no-store"
  })
  const result = await response.json()
  return { props: { game: result.data } }
}) satisfies GetStaticProps<{
  game: Game
}>

export const enterGameSchema = z.object({
  gameId: z
    .string()
    .min(5, {
      message: "ID inválido"
    })
    .max(5, {
      message: "ID inválido"
    })
})
export type EnterGameSchema = z.infer<typeof enterGameSchema>

export default function Page({
  game
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const params = useParams()

  console.log(params)

  //   const response = await fetch(`/api/game/${params.id}`, { cache: "no-store" })

  //   console.log({ response })

  return <>ok</>

  /* const [savedGame, saveGame] = useLocalStorage<Game | undefined>(
    "game",
    undefined
  )

  const form = useForm<EnterGameSchema>({
    resolver: zodResolver(enterGameSchema),
    defaultValues: {
      gameId: ""
    },
    mode: "onSubmit"
  })

  async function handleEnterGame(data: EnterGameSchema) {
    const response = await fetch("/api/game", {
      method: "POST",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      return toast.error((await response.json()).message)
    }

    const result = await response.json()

    saveGame(result.data)
  }

  const game = savedGame

  if (!game) return null

  return (
    <div suppressHydrationWarning>
      <Wrapper>
        <WrapperHeader title={`Jogo #${game.id}`}>
        <WrapperHeader title="Jogo">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ChevronLeft className="size-4" />
              <div className="font-semibold">Voltar</div>
            </Button>
          </Link>
        </WrapperHeader>

        <WrapperBody>
          <div className="flex flex-col gap-8">
            <div className="flex flex-col items-center gap-3">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleEnterGame)}
                  className="space-y-2"
                >
                  <div className="space-y-4 py-3">
                    <div className="space-y-1">
                      <Label htmlFor="description">ID do Jogo</Label>
                      <FormField
                        control={form.control}
                        name="gameId"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormControl>
                              <Input
                                placeholder="ID do Jogo"
                                maxLength={5}
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => {
                                  e.currentTarget.value = e.currentTarget.value
                                    .toUpperCase()
                                    .replaceAll(" ", "")

                                  field.onChange(e)
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button type="submit" className="w-full">
                      Entrar no Jogo
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </WrapperBody>
      </Wrapper>
    </div>
  ) */
}
