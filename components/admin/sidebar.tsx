"use client"

/**
 * Modern Cinematic Admin Sidebar Component
 * Enhanced with glassmorphism, animations, and premium design
 * Now fully theme-aware for both light and dark modes.
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
  Images,
  Sparkles,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { RootState } from "@/redux/store"
import { toggleSidebar } from "@/redux/slices/dashboardSlice"

// Menu items remain the same, gradients are decorative and theme-independent
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Banners",
    icon: ImageIcon,
    href: "/admin/banners",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "About Us",
    icon: FileText,
    href: "/admin/about",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Events",
    icon: Calendar,
    href: "/admin/events",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Team",
    icon: Users,
    href: "/admin/team",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Gallery",
    icon: Camera,
    href: "/admin/gallery",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    title: "Media",
    icon: Images,
    href: "/admin/media",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    title: "Testimonials",
    icon: MessageSquare,
    href: "/admin/testimonials",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    title: "Contact Messages",
    icon: Mail,
    href: "/admin/contacts",
    gradient: "from-teal-500 to-green-500",
  },
]

const settingsItems = [
  {
    title: "Profile",
    icon: User,
    href: "/admin/profile",
    gradient: "from-slate-500 to-gray-500",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/admin/settings",
    gradient: "from-gray-500 to-slate-500",
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
      className={`${
        sidebarCollapsed ? "w-20" : "w-72"
      } relative flex flex-col h-full transition-all duration-500 ease-in-out overflow-hidden`}
    >
      {/* Background with glassmorphism - Now uses theme variables */}
      <div className="absolute inset-0 bg-background">
        {/* Animated background pattern - colors can remain for decorative effect */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Glass overlay - Now uses theme variables */}
        <div className="absolute inset-0 backdrop-blur-3xl bg-background/80 dark:bg-background/50 border-r border-border"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Toggle Button - Now uses theme variables */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleSidebar}
          className="absolute right-5 top-8 z-50 w-8 h-8 bg-secondary text-secondary-foreground hover:bg-muted border border-border shadow-xl hover:shadow-2xl transition-all duration-300 rounded-full group"
        >
          <div className="relative ">
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <ChevronLeft className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            )}
          </div>
        </Button>

        {/* Logo Section - Now uses theme variables */}
        <div
          className={`p-6 border-b border-border ${
            sidebarCollapsed ? "px-4" : ""
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl ring-2 ring-primary/20">
                <Shield className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-background animate-pulse"></div>
            </div>
            {!sidebarCollapsed && (
              <div className="space-y-1">
                <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  School CMS
                </h2>
                <div className="flex items-center space-x-1">
                  <Sparkles className="h-3 w-3 text-yellow-400 animate-pulse" />
                  <p className="text-xs text-muted-foreground font-medium">
                    Admin Panel
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Info - Now uses theme variables */}
        {!sidebarCollapsed && (
          <div className="p-6 border-b border-border">
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-inner">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center ring-2 ring-primary/20">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "admin@school.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation - Now uses theme variables */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {/* Main Menu */}
            <div>
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Content Management
                  </p>
                </div>
              )}
              <ul className="space-y-2">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <li
                      key={item.href}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-fade-in-up"
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center ${
                          sidebarCollapsed
                            ? "justify-center px-3 py-4"
                            : "px-4 py-3"
                        } rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                          isActive
                            ? "bg-primary/10 backdrop-blur-sm shadow-2xl ring-1 ring-primary/20 border border-primary/10"
                            : "hover:bg-muted/50 hover:backdrop-blur-sm hover:shadow-xl hover:ring-1 hover:ring-border"
                        }`}
                        title={sidebarCollapsed ? item.title : undefined}
                      >
                        {/* Background gradient effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                        ></div>

                        {/* Icon */}
                        <div
                          className={`relative z-10 ${
                            sidebarCollapsed ? "" : "mr-4"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl bg-gradient-to-br ${
                              item.gradient
                            } ${
                              isActive ? "shadow-lg" : "shadow-md group-hover:shadow-lg"
                            } transition-all duration-300`}
                          >
                            <item.icon className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        {/* Text */}
                        {!sidebarCollapsed && (
                          <span
                            className={`relative z-10 font-medium transition-colors duration-300 ${
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          >
                            {item.title}
                          </span>
                        )}

                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                        )}

                        {/* Tooltip for collapsed state */}
                        {sidebarCollapsed && (
                          <div className="absolute left-20 bg-card text-card-foreground px-3 py-2 rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl ring-1 ring-border">
                            {item.title}
                            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-card rotate-45"></div>
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
                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-pulse"></div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Account
                  </p>
                </div>
              )}
              <ul className="space-y-2">
                {settingsItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <li
                      key={item.href}
                      style={{
                        animationDelay: `${(menuItems.length + index) * 50}ms`,
                      }}
                      className="animate-fade-in-up"
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center ${
                          sidebarCollapsed
                            ? "justify-center px-3 py-4"
                            : "px-4 py-3"
                        } rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                          isActive
                            ? "bg-primary/10 backdrop-blur-sm shadow-2xl ring-1 ring-primary/20 border border-primary/10"
                            : "hover:bg-muted/50 hover:backdrop-blur-sm hover:shadow-xl hover:ring-1 hover:ring-border"
                        }`}
                        title={sidebarCollapsed ? item.title : undefined}
                      >
                        {/* Background gradient effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}
                        ></div>

                        {/* Icon */}
                        <div
                          className={`relative z-10 ${
                            sidebarCollapsed ? "" : "mr-4"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl bg-gradient-to-br ${
                              item.gradient
                            } ${
                              isActive ? "shadow-lg" : "shadow-md group-hover:shadow-lg"
                            } transition-all duration-300`}
                          >
                            <item.icon className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        {/* Text */}
                        {!sidebarCollapsed && (
                          <span
                            className={`relative z-10 font-medium transition-colors duration-300 ${
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover:text-foreground"
                            }`}
                          >
                            {item.title}
                          </span>
                        )}

                        {/* Active indicator */}
                        {isActive && (
                          <div className="absolute right-2 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                        )}

                        {/* Tooltip for collapsed state */}
                        {sidebarCollapsed && (
                          <div className="absolute left-20 bg-card text-card-foreground px-3 py-2 rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl ring-1 ring-border">
                            {item.title}
                            <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-card rotate-45"></div>
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

        {/* Footer - Now uses theme variables */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t border-border">
            <div className="bg-muted/50 backdrop-blur-sm rounded-2xl p-3 border border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-muted-foreground">
                    System Online
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">v2.0.1</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fade-in-up 0.6s ease-out forwards;
        }

        @keyframes fade-in-up {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Use the global custom-scrollbar class from globals.css */
        .custom-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .custom-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </div>
  )
}
