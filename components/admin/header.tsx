"use client"

import type React from "react"

/**
 * Admin Header Component
 * Enhanced header with search and notifications
 */
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { LogOut, User, Settings, Bell, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { RootState } from "@/redux/store"
import { logout } from "@/redux/slices/authSlice"
import {
  setSearchQuery,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setNotifications,
} from "@/redux/slices/dashboardSlice"
import { useToast } from "@/hooks/use-toast"

export function AdminHeader() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { user } = useSelector((state: RootState) => state.auth)
  const { searchQuery, notifications } = useSelector((state: RootState) => state.dashboard)
  const [showSearch, setShowSearch] = useState(false)

  // Initialize notifications
  useEffect(() => {
    const initialNotifications = [
      {
        id: "1",
        title: "New Contact Message",
        message: "You have received a new contact form submission",
        type: "info" as const,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: "2",
        title: "Event Reminder",
        message: "Science Fair event is scheduled for tomorrow",
        type: "warning" as const,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
      },
      {
        id: "3",
        title: "System Update",
        message: "CMS system has been updated successfully",
        type: "success" as const,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: true,
      },
    ]
    dispatch(setNotifications(initialNotifications))
  }, [dispatch])

  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    console.log("Logging out...")
    dispatch(logout())
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.replace("/admin/login")
  }

  const handleProfile = () => {
    router.push("/admin/profile")
  }

  const handleSettings = () => {
    router.push("/admin/settings")
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value))
  }

  const handleNotificationClick = (notificationId: string) => {
    dispatch(markNotificationAsRead(notificationId))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllNotificationsAsRead())
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex items-center space-x-4 flex-1">
          {showSearch ? (
            <div className="relative max-w-md flex-1 cursor-pointer">
              <Search className="cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-4 w-4" />
              <Input
                placeholder="Search content, events, team members..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-10 bg-blue-400 border-blue-200"
                autoFocus
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowSearch(false)
                  dispatch(setSearchQuery(""))
                }}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {searchQuery && (
            <div className="text-sm text-gray-500">
              Searching for: <span className="font-medium">"{searchQuery}"</span>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative cursor-pointer ">
                <Bell className="h-5 w-5 cursor-pointer" color="black" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-white cursor-pointer">
              <div className="flex items-center justify-between text-black px-3 py-2 border-b">
                <h3 className="font-medium">Notifications</h3> 
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" className="cursor-pointer text-black" onClick={handleMarkAllAsRead}>
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto text-black">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start p-3 cursor-pointer"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">{notification.title}</p>
                            {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 hover:bg-gray-50 px-3 py-2 cursor-pointer">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white text-gray-900 cursor-pointer">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
