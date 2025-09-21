"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart3,
  Calendar,
  Image,
  Users,
  MessageSquare,
  Eye,
  Mail,
  ArrowUp,
  Plus,
  Activity,
  Camera,
  Clock,
  MousePointer,
  Sparkles,
  Zap,
  RefreshCw,
  ChevronRight,
} from "lucide-react"
import type { RootState } from "@/redux/store"
import { fetchDashboardStats } from "@/redux/slices/dashboardSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

export function AdminDashboard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.auth)
  const { stats, recentActivity, loading, lastUpdated } = useAppSelector(
    (state: RootState) => state.dashboard
  )
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    dispatch(fetchDashboardStats())
    const interval = setInterval(() => {
      dispatch(fetchDashboardStats())
    }, 30000)
    return () => clearInterval(interval)
  }, [dispatch])

  const handleRefresh = () => {
    dispatch(fetchDashboardStats())
  }

  const handleQuickAction = (route: string) => {
    router.push(route)
  }

  const statsCards = [
    {
      title: "Total Banners",
      value: stats.totalBanners?.toString() || "0",
      icon: Image,
      gradient: "from-blue-600 via-blue-500 to-cyan-400",
      change: "+2 this week",
      changeColor: "text-emerald-400",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents?.toString() || "0",
      icon: Calendar,
      gradient: "from-emerald-600 via-emerald-500 to-teal-400",
      change: "+3 this month",
      changeColor: "text-emerald-400",
    },
    {
      title: "Team Members",
      value: stats.totalTeamMembers?.toString() || "0",
      icon: Users,
      gradient: "from-purple-600 via-purple-500 to-pink-400",
      change: "+1 this month",
      changeColor: "text-emerald-400",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials?.toString() || "0",
      icon: MessageSquare,
      gradient: "from-orange-600 via-orange-500 to-yellow-400",
      change: "+5 this week",
      changeColor: "text-emerald-400",
    },
    {
      title: "Gallery Photos",
      value: stats.totalGalleryItems?.toString() || "0",
      icon: Camera,
      gradient: "from-pink-600 via-pink-500 to-rose-400",
      change: "+12 this week",
      changeColor: "text-emerald-400",
    },
    {
      title: "Contact Messages",
      value: stats.totalContacts?.toString() || "0",
      icon: Mail,
      gradient: "from-indigo-600 via-indigo-500 to-blue-400",
      change: "+8 this week",
      changeColor: "text-emerald-400",
    },
  ]

  const quickActions = [
    {
      title: "Add Banner",
      description: "Create new homepage banner",
      icon: Image,
      gradient: "from-blue-500 to-cyan-400",
      route: "/admin/banners",
    },
    {
      title: "Add Event",
      description: "Schedule new school event",
      icon: Calendar,
      gradient: "from-emerald-500 to-teal-400",
      route: "/admin/events",
    },
    {
      title: "Add Team Member",
      description: "Add new staff member",
      icon: Users,
      gradient: "from-purple-500 to-pink-400",
      route: "/admin/team",
    },
    {
      title: "Add Testimonial",
      description: "Create new testimonial",
      icon: MessageSquare,
      gradient: "from-orange-500 to-yellow-400",
      route: "/admin/testimonials",
    },
  ]

  const analyticsCards = [
    {
      title: "Page Views Today",
      value: stats.pageViews?.toLocaleString() || "0",
      icon: Eye,
      gradient: "from-purple-500 to-indigo-400",
    },
    {
      title: "Unique Visitors",
      value: stats.totalVisitors?.toLocaleString() || "0",
      icon: Users,
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      title: "Avg. Session Duration",
      value: stats.avgSessionDuration || "0m 0s",
      icon: Clock,
      gradient: "from-emerald-500 to-teal-400",
    },
    {
      title: "Bounce Rate",
      value: `${stats.bounceRate || 0}%`,
      icon: MousePointer,
      gradient: "from-orange-500 to-red-400",
    },
  ]

  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return "N/A"
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Floating particles background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -inset-10 opacity-50">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary/50 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 4}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl opacity-50 dark:opacity-100"></div>
          <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground via-muted-foreground to-foreground bg-clip-text text-transparent">
                      Welcome back, {user?.name || "Guest"}!
                    </h1>
                    <p className="text-muted-foreground text-lg mt-1">
                      Manage your school's digital presence with style
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-muted-foreground text-sm">Last updated</p>
                <p className="text-foreground font-bold text-lg">
                  {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "N/A"}
                </p>
                <div className="flex items-center justify-end space-x-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-xs font-medium">LIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={stat.title}
              className="group relative overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.gradient} rounded-2xl blur-xl opacity-25 group-hover:opacity-50 transition-all duration-700`}></div>
              <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 hover:border-primary/20 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                  </div>
                  <div className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-500`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <ArrowUp className="w-4 h-4 text-emerald-400" />
                    <span className={stat.changeColor + " text-sm font-medium"}>{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-all duration-700"></div>
            <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Recent Activity</h3>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center space-x-2 px-4 py-2 bg-secondary hover:bg-muted border border-border rounded-xl text-secondary-foreground text-sm transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {recentActivity && recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-muted/50 transition-all duration-300 cursor-pointer group/item"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="relative mt-1">
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-ping opacity-75"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium group-hover/item:text-primary transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-muted-foreground text-sm">by {activity.user}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground text-sm">{formatTimeAgo(activity.timestamp)}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">No recent activity found.</p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-all duration-700"></div>
            <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Quick Actions</h3>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  {quickActions.map((action, index) => (
                    <button
                      key={action.title}
                      onClick={() => handleQuickAction(action.route)}
                      className="group/action relative overflow-hidden p-6 bg-secondary/50 border border-border rounded-2xl text-left transition-all duration-500 hover:border-primary/20 hover:scale-105 hover:-translate-y-1 shadow-xl"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover/action:opacity-10 transition-opacity duration-500`}></div>
                      <div className="relative">
                        <div className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-xl flex items-center justify-center mb-4 transform group-hover/action:rotate-12 transition-transform duration-500 shadow-lg`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-bold text-foreground text-lg mb-2 group-hover/action:text-transparent group-hover/action:bg-gradient-to-r group-hover/action:bg-clip-text group-hover/action:from-foreground group-hover/action:to-muted-foreground">
                          {action.title}
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {action.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Website Analytics */}
        <div className="group relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition-all duration-700"></div>
          <div className="relative bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Website Analytics</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-xs font-medium">REAL-TIME</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {analyticsCards.map((card, index) => (
                  <div
                    key={card.title}
                    className="group/card relative p-6 bg-secondary/30 border border-border rounded-2xl hover:border-primary/20 transition-all duration-500 hover:scale-105 cursor-pointer"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover/card:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                    <div className="relative text-center">
                      <div className={`w-12 h-12 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg transform group-hover/card:rotate-12 transition-transform duration-500`}>
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-3xl font-bold text-foreground mb-2">{card.value}</div>
                      <div className="text-muted-foreground text-sm">{card.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
