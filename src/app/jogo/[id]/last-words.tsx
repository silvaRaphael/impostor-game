"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { X } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

import { Button, buttonVariants } from "@/components/ui/button"
import { Game } from "@/app/api/game/route"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { getCookie } from "@/lib/helpers/cookie"
import { queryClient } from "@/components/providers"

export function LastWords({ game }: { game: Game }) {
  const router = useRouter()
  const savedPlayer = getCookie("player")

  const { mutateAsync: handleCreateNewWord } = useMutation({
    mutationKey: ["game", game.id],
    mutationFn: async () => {
      if (!savedPlayer) return toast.error("Não foi possível votar!")

      const response = await fetch(`/api/game/${game.id}/word`, {
        method: "POST",
        credentials: "include"
      })

      if (!response.ok) {
        return toast.error((await response.json()).message)
      }

      queryClient.invalidateQueries({
        queryKey: ["game", game.id]
      })
    }
  })

  const { mutateAsync: handleRemoveWord } = useMutation({
    mutationKey: ["game", game.id],
    mutationFn: async (word: string) => {
      if (!savedPlayer)
        return toast.error("Não foi possível remover a palavra!")

      const response = await fetch(`/api/game/${game.id}/word?word=${word}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!response.ok) {
        return toast.error((await response.json()).message)
      }

      queryClient.invalidateQueries({
        queryKey: ["game", game.id]
      })
    }
  })

  const { mutateAsync: handleVote } = useMutation({
    mutationKey: ["game", game.id],
    mutationFn: async (to: string) => {
      if (!savedPlayer) return toast.error("Não foi possível votar!")

      const response = await fetch(`/api/game/${game.id}/vote`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          to
        })
      })

      if (!response.ok) {
        return toast.error((await response.json()).message)
      }

      queryClient.invalidateQueries({
        queryKey: ["game", game.id]
      })
    }
  })

  const { mutateAsync: handleRemoveGame } = useMutation({
    mutationKey: ["game", game.id],
    mutationFn: async () => {
      if (!savedPlayer) return toast.error("Não foi possível remover o jogo!")

      const response = await fetch(`/api/game?game=${game.id}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!response.ok) {
        return toast.error((await response.json()).message)
      }

      queryClient.invalidateQueries({
        queryKey: ["game", game.id]
      })

      router.push("/")
    }
  })

  return (
    <div className="space-y-3">
      <p className="font-medium">Jogo</p>
      <div className="w-full">
        <div className="flex flex-col items-center gap-3">
          {game.words.map((word, i) => (
            <div
              key={i}
              className="border rounded-lg flex w-full gap-3 px-4 py-2 justify-between items-center"
            >
              <p className="font-semibold">
                {!word.done && word.impostor === savedPlayer
                  ? "Impostor"
                  : word.word}
              </p>
              {word.done ? (
                <p className="font-semibold text-destructive">
                  {word.impostor}
                </p>
              ) : !!word.votes?.length ? (
                <p className="font-semibold text-xs">
                  Em Votação ( {word.votes.length} )
                </p>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => handleRemoveWord(word.word)}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          ))}

          {(game.words?.length === 0 ||
            game.words[game.words.length - 1].done) &&
            game.words.length < game.rounds &&
            game.creator !== savedPlayer && (
              <p
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" }),
                  "w-full pointer-events-none"
                )}
              >
                Aguardando Palavra
              </p>
            )}

          {(game.words?.length === 0 ||
            game.words[game.words.length - 1].done) &&
          game.words.length < game.rounds ? (
            game.creator === savedPlayer && (
              <Button className="w-full" onClick={() => handleCreateNewWord()}>
                Nova Palavra
              </Button>
            )
          ) : game.words[game.words.length - 1].votes.find(
              (vote) => vote.from === savedPlayer
            ) ? (
            <p
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-full pointer-events-none"
              )}
            >
              {game.words.length < game.rounds ? "Já Votou" : "Jogo Finalizado"}
            </p>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">
                  Votar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Votação</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                  Você só pode votar uma vez.
                </DialogDescription>

                {game.players
                  .filter((player) => player.name !== savedPlayer)
                  .sort((a, b) => b.score - a.score)
                  .map((player, i) => (
                    <div
                      key={i}
                      className="border rounded-lg flex w-full gap-3 px-4 py-2 justify-between items-center font-semibold"
                    >
                      <p>{player.name}</p>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleVote(player.name)}
                      >
                        Votar
                      </Button>
                    </div>
                  ))}
              </DialogContent>
            </Dialog>
          )}

          {game.words.length === game.rounds &&
            game.words[game.words.length - 1].done &&
            game.creator === savedPlayer && (
              <Button className="w-full" onClick={() => handleRemoveGame()}>
                Excluir Jogo
              </Button>
            )}
        </div>
      </div>
    </div>
  )
}
