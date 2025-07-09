"use client"

/**
 * Admin Main Page
 * Redirects to dashboard or login based on auth state
 */
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { AdminLayout } from "@/components/admin/layout"
import { AdminDashboard } from "@/components/admin/dashboard"
import { Spinner } from "@/components/ui/spinner"

export default function AdminPage() {
  const router = useRouter()
  const { isAuthenticated, loading, initialized } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    console.log("Admin page mounted, auth state:", { isAuthenticated, loading, initialized })

    if (initialized && !isAuthenticated) {
      console.log("Not authenticated, redirecting to login...")
      router.replace("/admin/login")
    }
  }, [initialized, isAuthenticated, router])

  // Show loading while checking auth state
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="large" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Show dashboard if authenticated
  if (isAuthenticated) {
    return (
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    )
  }

  // This shouldn't render due to redirect, but just in case
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Spinner size="large" />
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}
