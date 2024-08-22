import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"

import { ThemeProvider } from "./theme-provider"
import { Toaster } from "./ui/sonner"
import { ThemeToggle } from "./theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export function Wrapper({ children }: { children?: React.ReactNode }) {
  return (
    <div className={cn(inter.className, "flex flex-col p-5 min-h-screen")}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </div>
  )
}

export function WrapperHeader({
  title,
  children
}: {
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="relative flex justify-center items-center gap-4 h-10">
      <div className="absolute start-0">{children}</div>
      <h1 className="font-semibold">{title}</h1>
      <div className="absolute end-0">
        <ThemeToggle />
      </div>
    </div>
  )
}

export function WrapperBody({
  children,
  className
}: {
  children?: React.ReactNode
  className?: string
}) {
  return (
    <main
      className={cn(
        "flex flex-1 justify-center items-center w-full max-w-sm mx-auto",
        className
      )}
    >
      {children}
    </main>
  )
}
