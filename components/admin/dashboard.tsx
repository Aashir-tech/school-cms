"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Calendar,
  ImageIcon,
  Users,
  MessageSquare,
  Eye,
  Mail,
  TrendingUp,
  Plus,
  Activity,
  Camera,
  Clock,
  MousePointer,
} from "lucide-react"
import type { RootState } from "@/redux/store"
import { fetchDashboardStats } from "@/redux/slices/dashboardSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

export function AdminDashboard() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state: RootState) => state.auth)
  const { stats, recentActivity, loading, lastUpdated } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    // Initial fetch
    dispatch(fetchDashboardStats())

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchDashboardStats())
    }, 30000)

    return () => clearInterval(interval)
  }, [dispatch])

  const statsCards = [
    {
      title: "Total Banners",
      value: stats.totalBanners.toString(),
      icon: ImageIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+2 this week",
      changeColor: "text-green-600",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents.toString(),
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+3 this month",
      changeColor: "text-green-600",
    },
    {
      title: "Team Members",
      value: stats.totalTeamMembers.toString(),
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+1 this month",
      changeColor: "text-green-600",
    },
    {
      title: "Testimonials",
      value: stats.totalTestimonials.toString(),
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "+5 this week",
      changeColor: "text-green-600",
    },
    {
      title: "Gallery Photos",
      value: stats.totalGalleryItems.toString(),
      icon: Camera,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      change: "+12 this week",
      changeColor: "text-green-600",
    },
    {
      title: "Contact Messages",
      value: stats.totalContacts.toString(),
      icon: Mail,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      change: "+8 this week",
      changeColor: "text-green-600",
    },
  ]

  const quickActions = [
    {
      title: "Add Banner",
      description: "Create new homepage banner",
      icon: ImageIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverColor: "hover:bg-blue-100",
      route: "/admin/banners",
    },
    {
      title: "Add Event",
      description: "Schedule new school event",
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      hoverColor: "hover:bg-green-100",
      route: "/admin/events",
    },
    {
      title: "Add Team Member",
      description: "Add new staff member",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      hoverColor: "hover:bg-purple-100",
      route: "/admin/team",
    },
    {
      title: "Add Testimonial",
      description: "Create new testimonial",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      hoverColor: "hover:bg-orange-100",
      route: "/admin/testimonials",
    },
  ]

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    return `${Math.floor(diffInHours / 24)} days ago`
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mt-1">Here's what's happening with your school website today.</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Last updated</p>
            <p className="text-white font-medium">
              {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "Never"}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center mt-2">
                <TrendingUp className={`h-3 w-3 mr-1 ${stat.changeColor}`} />
                <span className={`text-xs ${stat.changeColor}`}>{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="hover:shadow-lg transition-shadow duration-200 text-gray-500">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(fetchDashboardStats())}
              disabled={loading}
              className="cursor-pointer hover:bg-blue-50"
            >
              {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" /> : "Refresh"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">{formatTimeAgo(activity.timestamp)}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="h-5 w-5 mr-2 text-green-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.title}
                  onClick={() => router.push(action.route)}
                  className={`p-4 border border-gray-200 rounded-lg text-left transition-all duration-200 ${action.hoverColor} hover:shadow-md hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer`}
                >
                  <div className={`p-2 rounded-lg ${action.bgColor} w-fit mb-3`}>
                    <action.icon className={`h-6 w-6 ${action.color}`} />
                  </div>
                  <div className="font-medium text-gray-900">{action.title}</div>
                  <div className="text-sm text-gray-500 mt-1">{action.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Website Overview - Real-time Analytics */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-purple-600" />
            Website Analytics (Real-time)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors cursor-pointer">
              <div className="flex items-center justify-center mb-2">
                <Eye className="h-5 w-5 text-purple-600 mr-2" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.pageViews.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Page Views Today</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-5 w-5 text-blue-600 mr-2" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.totalVisitors.toLocaleString()}</div>
              <div className="text-sm text-gray-500">Unique Visitors</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors cursor-pointer">
              <div className="flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-green-600 mr-2" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.avgSessionDuration}</div>
              <div className="text-sm text-gray-500">Avg. Session Duration</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
              <div className="flex items-center justify-center mb-2">
                <MousePointer className="h-5 w-5 text-orange-600 mr-2" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.bounceRate}%</div>
              <div className="text-sm text-gray-500">Bounce Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
