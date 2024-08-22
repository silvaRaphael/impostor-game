"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { Game } from "@/app/api/game/route"
import { X } from "lucide-react"

export function CreateNewWordForm({ game }: { game: Game }) {
  const [, saveGame] = useLocalStorage<Game | undefined>("game", undefined)

  async function handleCreateNewWord() {
    const response = await fetch(`/api/game/${game.id}`, {
      method: "POST"
    })

    if (!response.ok) {
      return toast.error((await response.json()).message)
    }

    const result = await response.json()

    saveGame(result.data)
  }

  async function handleRemoveWord(word: string) {
    const response = await fetch(`/api/game/${game.id}?word=${word}`, {
      method: "DELETE"
    })

    if (!response.ok) {
      return toast.error((await response.json()).message)
    }

    const result = await response.json()

    saveGame(result.data)
  }

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-3">
        {game.words.map((word, i) => (
          <div
            key={i}
            className="border rounded-lg flex w-full gap-3 px-4 py-2 justify-between"
          >
            <p className="font-semibold">{word.word}</p>
            {word.impostor ? (
              <p className="font-semibold text-destructive">{word.impostor}</p>
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

        <Button className="w-full" onClick={handleCreateNewWord}>
          Nova Palavra
        </Button>
      </div>
    </div>
  )
}
