import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Wrapper, WrapperBody, WrapperHeader } from "@/components/wrapper"
import { CreateNewGameForm } from "./form"
import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <Wrapper>
      <WrapperHeader title="Criar Novo Jogo">
        <Link
          href="/"
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
        <div className="flex flex-col gap-8">
          <CreateNewGameForm />
        </div>
      </WrapperBody>
    </Wrapper>
  )
}
