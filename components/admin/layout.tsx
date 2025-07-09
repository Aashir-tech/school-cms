"use client"

import type React from "react"

/**
 * Admin Layout Component
 * Main layout wrapper for admin pages
 */
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { AdminSidebar } from "./sidebar"
import { AdminHeader } from "./header"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { sidebarCollapsed } = useSelector((state: RootState) => state.dashboard)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
