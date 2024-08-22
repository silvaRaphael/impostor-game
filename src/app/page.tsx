import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { Wrapper, WrapperBody, WrapperHeader } from "@/components/wrapper"
import { cn } from "@/lib/utils"

export default function Page() {
  return (
    <Wrapper>
      <WrapperHeader title="Jogo do Impostor" />

      <WrapperBody>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3">
            <Link href="/jogo" className={cn(buttonVariants(), "w-full")}>
              Entrar em um Jogo
            </Link>

            <Link
              href="/jogo/novo"
              className={cn(
                buttonVariants({ variant: "destructive" }),
                "w-full"
              )}
            >
              Criar Novo Jogo
            </Link>
          </div>
        </div>
      </WrapperBody>
    </Wrapper>
  )
}
