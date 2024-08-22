import { ChevronLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Wrapper, WrapperBody, WrapperHeader } from "@/components/wrapper"
import { EnterGameForm } from "./form"

export default function Page() {
  return (
    <Wrapper>
      <WrapperHeader title="Entrar no Jogo">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ChevronLeft className="size-4" />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
      </WrapperHeader>

      <WrapperBody>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-3">
            <EnterGameForm />
          </div>
        </div>
      </WrapperBody>
    </Wrapper>
  )
}
