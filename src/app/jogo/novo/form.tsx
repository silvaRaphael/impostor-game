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
import { generateShortKey } from "@/lib/helpers/generate-shor-key"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

export const createNewGameSchema = z.object({
  gameId: z
    .string()
    .min(5, {
      message: "ID inválido"
    })
    .max(5, {
      message: "ID inválido"
    }),
  rounds: z
    .number()
    .min(1, {
      message: "Nº de rodadas inválido"
    })
    .max(10, {
      message: "Nº de rodadas inválido"
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
export type CreateNewGameSchema = z.infer<typeof createNewGameSchema>

export function CreateNewGameForm() {
  const router = useRouter()

  const form = useForm<CreateNewGameSchema>({
    resolver: zodResolver(createNewGameSchema),
    defaultValues: {
      gameId: generateShortKey(5),
      rounds: 5,
      player: ""
    },
    mode: "onChange"
  })

  async function handleCreateNewGame(data: CreateNewGameSchema) {
    const response = await fetch("/api/game", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      return toast.error((await response.json()).message)
    }

    const result = await response.json()

    router.push(`/jogo/${result.data.id}`)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateNewGame)}
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

          <div className="space-y-1">
            <Label htmlFor="rounds">Nº de Rodadas</Label>
            <FormField
              control={form.control}
              name="rounds"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      defaultValue={String(field.value)}
                      onValueChange={(e) => {
                        field.onChange(Number(e))
                      }}
                      name={field.name}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Nº de Rodadas" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }).map((_, i) => (
                          <SelectItem key={i} value={String(i + 1)}>
                            {i + 1} Rodada
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        e.currentTarget.value =
                          e.currentTarget.value.toUpperCase()

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
            Criar Novo Jogo
          </Button>
        </div>
      </form>
    </Form>
  )
}
