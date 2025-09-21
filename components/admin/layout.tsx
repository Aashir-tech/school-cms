"use client"

import type React from "react"
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
    // Use `bg-background` to make the entire layout theme-aware.
    <div className="flex h-screen bg-background text-foreground">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader />

        {/* The main content area now uses `bg-background`. 
            Removed padding `p-6` to avoid double-padding, 
            as page components like the dashboard manage their own padding. */}
        <main className="flex-1 overflow-y-auto bg-background">
          {/* The max-w-7xl and mx-auto can be kept here if you want a centered, max-width container for all admin pages */}
          <div className="max-w-7xl mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
