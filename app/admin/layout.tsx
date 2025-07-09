// "use client"

// /**
//  * Admin Layout Component
//  * Simple layout that only handles login page exclusion
//  */
// import type React from "react"
// import { usePathname } from "next/navigation"

// export default function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const pathname = usePathname()

//   // If on login page, render without any layout
//   if (pathname === "/admin/login") {
//     return <>{children}</>
//   }

//   // For all other admin pages, they will handle their own authentication
//   return <>{children}</>
// }


/**
 * Admin Layout Component
 * Simple wrapper that doesn't interfere with routing
 */
import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
