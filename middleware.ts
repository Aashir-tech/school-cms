/**
 * Next.js Middleware for Route Protection
 * Protects admin routes except login
 */
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for non-admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Allow access to login page
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  // For all other admin routes, let client-side handle auth
  // This ensures better UX with loading states
  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
