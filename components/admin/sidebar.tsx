"use client"

/**
 * Admin Sidebar Component
 * Enhanced navigation with toggle functionality
 */
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import {
  LayoutDashboard,
  ImageIcon,
  Users,
  Calendar,
  MessageSquare,
  Settings,
  FileText,
  Camera,
  Mail,
  User,
  ChevronLeft,
  ChevronRight,
  Images
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RootState } from "@/redux/store"
import { toggleSidebar } from "@/redux/slices/dashboardSlice"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Banners",
    icon: ImageIcon,
    href: "/admin/banners",
  },
  {
    title: "About Us",
    icon: FileText,
    href: "/admin/about",
  },
  {
    title: "Events",
    icon: Calendar,
    href: "/admin/events",
  },
  {
    title: "Team",
    icon: Users,
    href: "/admin/team",
  },
  {
    title: "Gallery",
    icon: Camera,
    href: "/admin/gallery",
  },
  {
    title: "Media",
    icon: Images,
    href: "/admin/media",
  },
  {
    title: "Testimonials",
    icon: MessageSquare,
    href: "/admin/testimonials",
  },
  {
    title: "Contact Messages",
    icon: Mail,
    href: "/admin/contacts",
  },
]

const settingsItems = [
  {
    title: "Profile",
    icon: User,
    href: "/admin/profile",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { sidebarCollapsed } = useSelector((state: RootState) => state.dashboard)

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar())
  }

  return (
    <div
      className={`${sidebarCollapsed ? "w-16" : "w-64"} bg-white shadow-lg border-r border-gray-200 transition-all duration-300 relative flex flex-col h-full`}
    >
      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggleSidebar}
        className="absolute -right-3 top-6 z-10 bg-white border border-gray-200 shadow-md hover:shadow-lg hover:bg-gray-50"
      >
        {sidebarCollapsed ? <ChevronRight className="h-4 w-4" color="black" /> : <ChevronLeft className="h-4 w-4" color="black" />}
      </Button>

      {/* Logo Section */}
      <div className={`p-6 border-b border-gray-200 ${sidebarCollapsed ? "px-3" : ""}`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          {!sidebarCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">School CMS</h2>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {!sidebarCollapsed && (
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Main Menu */}
          <div>
            {!sidebarCollapsed && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Content Management</p>
            )}
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center ${sidebarCollapsed ? "justify-center px-2" : "px-3"} py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                        isActive
                          ? "bg-blue-100 text-blue-700 shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                      }`}
                      title={sidebarCollapsed ? item.title : undefined}
                    >
                      <item.icon className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
                      {!sidebarCollapsed && item.title}
                      {sidebarCollapsed && (
                        <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.title}
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Settings Menu */}
          <div>
            {!sidebarCollapsed && (
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Account</p>
            )}
            <ul className="space-y-1">
              {settingsItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center ${sidebarCollapsed ? "justify-center px-2" : "px-3"} py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                        isActive
                          ? "bg-blue-100 text-blue-700 shadow-sm"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
                      }`}
                      title={sidebarCollapsed ? item.title : undefined}
                    >
                      <item.icon className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
                      {!sidebarCollapsed && item.title}
                      {sidebarCollapsed && (
                        <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                          {item.title}
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
