import { Providers } from "@/components/providers"
import "@/styles/globals.css"
import React from "react"

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <title>Jogo do Impostor</title>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
