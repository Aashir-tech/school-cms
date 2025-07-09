// "use client"

// /**
//  * Admin Dashboard Page
//  * Main dashboard with statistics and overview
//  */
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { BarChart3, Calendar, ImageIcon, Users, MessageSquare, Eye } from "lucide-react"

// const stats = [
//   {
//     title: "Total Banners",
//     value: "5",
//     icon: ImageIcon,
//     color: "text-blue-600",
//   },
//   {
//     title: "Upcoming Events",
//     value: "12",
//     icon: Calendar,
//     color: "text-green-600",
//   },
//   {
//     title: "Team Members",
//     value: "25",
//     icon: Users,
//     color: "text-purple-600",
//   },
//   {
//     title: "Testimonials",
//     value: "18",
//     icon: MessageSquare,
//     color: "text-orange-600",
//   },
//   {
//     title: "Gallery Photos",
//     value: "150",
//     icon: Eye,
//     color: "text-pink-600",
//   },
//   {
//     title: "Page Views",
//     value: "2,543",
//     icon: BarChart3,
//     color: "text-indigo-600",
//   },
// ]

// export default function AdminDashboard() {
//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <p className="text-gray-600">Welcome to your school CMS dashboard</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {stats.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
//               <stat.icon className={`h-5 w-5 ${stat.color}`} />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Dashboard Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <span className="text-sm">New event "Science Fair" added</span>
//                 <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span className="text-sm">Banner updated</span>
//                 <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                 <span className="text-sm">New team member added</span>
//                 <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-4">
//               <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
//                 <ImageIcon className="h-6 w-6 text-blue-600 mb-2" />
//                 <div className="font-medium">Add Banner</div>
//                 <div className="text-sm text-gray-500">Create new banner</div>
//               </button>
//               <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
//                 <Calendar className="h-6 w-6 text-green-600 mb-2" />
//                 <div className="font-medium">Add Event</div>
//                 <div className="text-sm text-gray-500">Schedule new event</div>
//               </button>
//               <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
//                 <Users className="h-6 w-6 text-purple-600 mb-2" />
//                 <div className="font-medium">Add Team Member</div>
//                 <div className="text-sm text-gray-500">Add staff member</div>
//               </button>
//               <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
//                 <MessageSquare className="h-6 w-6 text-orange-600 mb-2" />
//                 <div className="font-medium">Add Testimonial</div>
//                 <div className="text-sm text-gray-500">New testimonial</div>
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }
// "use client"

// /**
//  * Admin Dashboard Page
//  * Main dashboard with statistics and overview
//  */
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { BarChart3, Calendar, ImageIcon, Users, MessageSquare, Eye } from "lucide-react"

// const stats = [
//   {
//     title: "Total Banners",
//     value: "5",
//     icon: ImageIcon,
//     color: "text-blue-600",
//   },
//   {
//     title: "Upcoming Events",
//     value: "12",
//     icon: Calendar,
//     color: "text-green-600",
//   },
//   {
//     title: "Team Members",
//     value: "25",
//     icon: Users,
//     color: "text-purple-600",
//   },
//   {
//     title: "Testimonials",
//     value: "18",
//     icon: MessageSquare,
//     color: "text-orange-600",
//   },
//   {
//     title: "Gallery Photos",
//     value: "150",
//     icon: Eye,
//     color: "text-pink-600",
//   },
//   {
//     title: "Page Views",
//     value: "2,543",
//     icon: BarChart3,
//     color: "text-indigo-600",
//   },
// ]

// export default function AdminDashboard() {
//   return (
//     <div className="space-y-6">
//       {/* Page Header */}
//       <div>
//         <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//         <p className="text-gray-600">Welcome to your school CMS dashboard</p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {stats.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
//               <stat.icon className={`h-5 w-5 ${stat.color}`} />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Dashboard Content */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                 <span className="text-sm">New event "Science Fair" added</span>
//                 <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                 <span className="text-sm">Banner updated</span>
//                 <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
//               </div>
//               <div className="flex items-center space-x-3">
//                 <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                 <span className="text-sm">New team member added</span>
//                 <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Quick Actions</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-2 gap-4">
//               <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
//                 <ImageIcon className="h-6 w-6 text-blue-600 mb-2" />
//                 <div className="font-medium">Add Banner</div>
//                 <div className="text-sm text-gray-500">Create new banner</div>
//               </button>
//               <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
//                 <Calendar className="h-6 w-6 text-green-600 mb-2" />
//                 <div className="font-medium">Add Event</div>
//                 <div className="text-sm text-gray-500">Schedule new event</div>
//               </button>
//               <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
//                 <Users className="h-6 w-6 text-purple-600 mb-2" />
//                 <div className="font-medium">Add Team Member</div>
//                 <div className="text-sm text-gray-500">Add staff member</div>
//               </button>
//               <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
//                 <MessageSquare className="h-6 w-6 text-orange-600 mb-2" />
//                 <div className="font-medium">Add Testimonial</div>
//                 <div className="text-sm text-gray-500">New testimonial</div>
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }


"use client"

/**
 * Admin Dashboard Page
 * Main dashboard with statistics and overview
 */
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Calendar, ImageIcon, Users, MessageSquare, Eye } from "lucide-react"

const stats = [
  {
    title: "Total Banners",
    value: "5",
    icon: ImageIcon,
    color: "text-blue-600",
  },
  {
    title: "Upcoming Events",
    value: "12",
    icon: Calendar,
    color: "text-green-600",
  },
  {
    title: "Team Members",
    value: "25",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Testimonials",
    value: "18",
    icon: MessageSquare,
    color: "text-orange-600",
  },
  {
    title: "Gallery Photos",
    value: "150",
    icon: Eye,
    color: "text-pink-600",
  },
  {
    title: "Page Views",
    value: "2,543",
    icon: BarChart3,
    color: "text-indigo-600",
  },
]

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem("auth-user")
    if (userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
      }
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name || "Admin"}! Here's what's happening with your school website.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm">New event "Science Fair" added</span>
                <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Banner updated</span>
                <span className="text-xs text-gray-500 ml-auto">5 hours ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm">New team member added</span>
                <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <ImageIcon className="h-6 w-6 text-blue-600 mb-2" />
                <div className="font-medium">Add Banner</div>
                <div className="text-sm text-gray-500">Create new banner</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Calendar className="h-6 w-6 text-green-600 mb-2" />
                <div className="font-medium">Add Event</div>
                <div className="text-sm text-gray-500">Schedule new event</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <Users className="h-6 w-6 text-purple-600 mb-2" />
                <div className="font-medium">Add Team Member</div>
                <div className="text-sm text-gray-500">Add staff member</div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
                <MessageSquare className="h-6 w-6 text-orange-600 mb-2" />
                <div className="font-medium">Add Testimonial</div>
                <div className="text-sm text-gray-500">New testimonial</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Welcome Message */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Welcome to School CMS</h3>
              <p className="text-blue-700">
                Manage your school's website content easily. Use the sidebar to navigate between different sections.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
