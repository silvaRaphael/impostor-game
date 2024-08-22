import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  response.headers.set("Access-Control-Allow-Origin", "http://localhost:3000")
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  )
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  )
  response.headers.set("Access-Control-Allow-Credentials", "true")

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204 })
  }

  return response
}
