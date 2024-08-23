"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

import { Game } from "@/app/api/game/route"
import { Button } from "@/components/ui/button"
import { getCookie } from "@/lib/helpers/cookie"
import { queryClient } from "@/components/providers"

export function Scoreboard({ game }: { game: Game }) {
  const router = useRouter()
  const savedPlayer = getCookie("player")

  const { mutateAsync: handleRemovePlayer, isPending } = useMutation({
    mutationKey: ["game", game.id],
    mutationFn: async (player: string) => {
      if (!savedPlayer) return toast.error("Não foi possível remover jogador!")

      const response = await fetch(`/api/game/${game.id}?player=${player}`, {
        method: "DELETE",
        credentials: "include"
      })

      if (!response.ok) {
        return toast.error((await response.json()).message)
      }

      queryClient.invalidateQueries({
        queryKey: ["game", game.id]
      })

      router.push("/jogo")
    }
  })

  return (
    <div className="space-y-3">
      <p className="font-medium">Placar</p>

      <div className="flex flex-col items-center gap-3">
        {game.players
          .sort((a, b) => b.score - a.score)
          .map((player, i) => (
            <div
              key={i}
              className="border rounded-lg flex w-full gap-3 px-4 py-2 justify-between items-center font-semibold"
            >
              <p
                className={player.name === savedPlayer ? "text-amber-500" : ""}
              >
                {player.name}
              </p>

              <p>{player.score}</p>
            </div>
          ))}

        {savedPlayer && game.creator !== savedPlayer && (
          <Button
            variant="secondary"
            size="icon"
            className="w-full"
            onClick={() => handleRemovePlayer(savedPlayer)}
            isLoading={isPending}
          >
            Sair
          </Button>
        )}
      </div>
    </div>
  )
}
