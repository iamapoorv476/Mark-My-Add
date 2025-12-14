import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Protected routes
  const isProtectedRoute = path.startsWith("/studio") || path.startsWith("/gallery")

  // Check for auth token in cookie
  const token = request.cookies.get("auth-storage")

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/studio/:path*", "/gallery/:path*"],
}
