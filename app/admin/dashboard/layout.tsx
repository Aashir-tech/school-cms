// "use client"

// /**
//  * Dashboard Layout Component
//  * Protected layout with authentication check and admin UI
//  */
// import type React from "react"
// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import { useSelector, useDispatch } from "react-redux"
// import type { RootState } from "@/redux/store"
// import { restoreAuth } from "@/redux/slices/authSlice"
// import { AdminSidebar } from "@/components/admin/sidebar"
// import { AdminHeader } from "@/components/admin/header"
// import { SidebarProvider } from "@/components/ui/sidebar"

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   const router = useRouter()
//   const dispatch = useDispatch()
//   const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
//   const [isInitialized, setIsInitialized] = useState(false)

//   useEffect(() => {
//     // Restore auth state from localStorage on mount
//     dispatch(restoreAuth())
//     setIsInitialized(true)
//   }, [dispatch])

//   useEffect(() => {
//     // Only redirect after initialization is complete
//     if (isInitialized && !loading && !isAuthenticated) {
//       router.push("/admin/login")
//     }
//   }, [isAuthenticated, loading, isInitialized, router])

//   // Show loading while initializing or checking auth
//   if (!isInitialized || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   // Show loading while redirecting to login
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Redirecting to login...</p>
//         </div>
//       </div>
//     )
//   }

//   // Render admin layout for authenticated users
//   return (
//     <SidebarProvider>
//       <div className="flex h-screen bg-gray-100">
//         <AdminSidebar />
//         <div className="flex-1 flex flex-col overflow-hidden">
//           <AdminHeader />
//           <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{children}</main>
//         </div>
//       </div>
//     </SidebarProvider>
//   )
// }


"use client"

/**
 * Dashboard Layout Component
 * Protected layout that checks authentication
 */
import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("auth-token")
        const user = localStorage.getItem("auth-user")

        if (token && user) {
          // Verify the user data is valid JSON
          JSON.parse(user)
          setIsAuthenticated(true)
          console.log("User authenticated for dashboard")
        } else {
          console.log("No auth found, redirecting to login")
          router.replace("/admin/login")
          return
        }
      } catch (error) {
        console.error("Auth check error:", error)
        // Clear invalid data
        localStorage.removeItem("auth-token")
        localStorage.removeItem("auth-user")
        router.replace("/admin/login")
        return
      } finally {
        setLoading(false)
      }
    }

    // Small delay to ensure localStorage is available
    const timer = setTimeout(checkAuth, 100)
    return () => clearTimeout(timer)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  )
}
