"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { Game } from "../api/game/route"

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

export function EnterGameForm() {
  const router = useRouter()
  const [, saveGame] = useLocalStorage<Game | undefined>("game", undefined)

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

    router.push(`/jogo/${result.data.id}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEnterGame)} className="space-y-2">
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
  )
}
