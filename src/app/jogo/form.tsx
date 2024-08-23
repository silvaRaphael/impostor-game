"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useRouter, useSearchParams } from "next/navigation"

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
import { slugify } from "@/lib/helpers/slugfy"
import { useMutation } from "@tanstack/react-query"

export const enterGameSchema = z.object({
  gameId: z
    .string()
    .min(5, {
      message: "ID inválido"
    })
    .max(5, {
      message: "ID inválido"
    }),
  player: z
    .string()
    .min(1, {
      message: "Nome inválido"
    })
    .max(15, {
      message: "Nome muito longo"
    })
})
export type EnterGameSchema = z.infer<typeof enterGameSchema>

export function EnterGameForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const form = useForm<EnterGameSchema>({
    resolver: zodResolver(enterGameSchema),
    defaultValues: {
      gameId: searchParams.get("id") || "",
      player: ""
    },
    mode: "onSubmit"
  })

  const { mutateAsync: handleEnterGame, isPending } = useMutation({
    mutationKey: ["game"],
    mutationFn: async (data: EnterGameSchema) => {
      const response = await fetch(`/api/game/${data.gameId}`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          player: data.player.trim()
        })
      })

      if (!response.ok) {
        return toast.error((await response.json()).message)
      }

      const result = await response.json()

      router.push(`/jogo/${result.data.id}`)
    }
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleEnterGame(data))}
        className="space-y-2"
      >
        <div className="space-y-4 py-3">
          <div className="space-y-1">
            <Label htmlFor="gameId">ID do Jogo</Label>
            <FormField
              control={form.control}
              name="gameId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="ID do Jogo"
                      maxLength={5}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        e.currentTarget.value = slugify(
                          e.currentTarget.value,
                          ""
                        )

                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="player">Seu Nome</Label>
            <FormField
              control={form.control}
              name="player"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Seu Nome"
                      maxLength={15}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        e.currentTarget.value = slugify(
                          e.currentTarget.value,
                          ""
                        )

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
          <Button type="submit" className="w-full" isLoading={isPending}>
            Entrar no Jogo
          </Button>
        </div>
      </form>
    </Form>
  )
}
