"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { ChevronLeft, ExternalLink, Link2 } from "lucide-react"
import QRCode from "qrcode"

import { Button, buttonVariants } from "@/components/ui/button"
import { Wrapper, WrapperBody, WrapperHeader } from "@/components/wrapper"
import { Game } from "@/app/api/game/route"
import { cn } from "@/lib/utils"
import { Scoreboard } from "./scoreboard"
import { LastWords } from "./last-words"
import { LoadingSpinner } from "@/components/loading-spinner"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { useGameData } from "@/lib/hooks/use-firestore-listener"

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [qrCodeUrl, setQRCodeUrl] = useState("")

  // const { data: game, isLoading } = useQuery({
  //   queryKey: ["game", params.id],
  //   queryFn: async () => {
  //     const response = await fetch(`/api/game/${params.id}`, {
  //       method: "GET",
  //       cache: "no-store",
  //       credentials: "include"
  //     })

  //     const game = (await response.json()).data as Game

  //     if (!game) {
  //       router.push("/")
  //     }

  //     return game
  //   },
  //   staleTime: 0,
  //   refetchInterval: 5000
  // })

  const {
    data: game,
    error,
    isLoading
  } = useGameData(["game", params.id], "games", params.id)

  useEffect(() => {
    const generateQRCode = async (text: string) => {
      try {
        const url = await QRCode.toDataURL(text, {
          margin: 1,
          type: "image/webp",
          errorCorrectionLevel: "M"
        })
        setQRCodeUrl(url)
      } catch (_) {}
    }

    if (game)
      generateQRCode(`${process.env.NEXT_PUBLIC_API_URL}/jogo?id=${game.id}`)
  }, [game])

  if (isLoading)
    return (
      <Wrapper>
        <WrapperBody>
          <LoadingSpinner />
        </WrapperBody>
      </Wrapper>
    )
  if (error || !game) {
    router.push("/")
    return null
  }
  if (!game) return null

  return (
    <Wrapper>
      <WrapperHeader
        title={
          <Dialog>
            <DialogTrigger className="flex items-center gap-1">
              Jogo #{game.id} <Link2 className="size-3.5 -rotate-45" />
            </DialogTrigger>
            <DialogContent className="space-y-3">
              <DialogHeader>
                <DialogTitle>Compartilhar Jogo</DialogTitle>
              </DialogHeader>
              <div className="p-3 bg-muted rounded-xl w-full max-w-xs mx-auto border">
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-full max-w-xs mx-auto"
                />
              </div>
              <DialogFooter className="flex-row gap-2 justify-end">
                <DialogClose className={buttonVariants({ variant: "outline" })}>
                  Fechar
                </DialogClose>
                <Button
                  onClick={() => {
                    navigator.clipboard
                      .writeText(
                        `${process.env.NEXT_PUBLIC_API_URL}/jogo?id=${game.id}`
                      )
                      .then(() => toast.success("Link copiado!"))
                  }}
                >
                  Copiar Link
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      >
        <Link
          href="/jogo"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "flex"
          )}
        >
          <ChevronLeft className="size-4" />
          <span className="sr-only">Voltar</span>
        </Link>
      </WrapperHeader>

      <WrapperBody>
        <div className="flex flex-col gap-8 w-full">
          <Scoreboard game={game} />

          <LastWords game={game} />
        </div>
      </WrapperBody>
    </Wrapper>
  )
}
