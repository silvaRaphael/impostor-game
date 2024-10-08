import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Wrapper, WrapperBody, WrapperHeader } from "@/components/wrapper"
import { EnterGameForm } from "./form"
import { cn } from "@/lib/utils"
import { Suspense } from "react"

export default function Page() {
  return (
    <Wrapper>
      <WrapperHeader title="Entrar no Jogo">
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
          <Suspense>
            <EnterGameForm />
          </Suspense>
        </div>
      </WrapperBody>
    </Wrapper>
  )
}
