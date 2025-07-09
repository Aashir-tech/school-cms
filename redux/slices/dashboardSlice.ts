import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

export interface DashboardStats {
  totalBanners: number
  totalEvents: number
  upcomingEvents: number
  totalTeamMembers: number
  totalTestimonials: number
  totalGalleryItems: number
  totalContacts: number
  pageViews: number
  totalVisitors: number
  bounceRate: number
  avgSessionDuration: string
}

export interface RecentActivity {
  id: string
  type: "banner" | "event" | "team" | "testimonial" | "gallery" | "contact"
  action: "created" | "updated" | "deleted"
  title: string
  timestamp: string
  user: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
}

interface DashboardState {
  stats: DashboardStats
  recentActivity: RecentActivity[]
  notifications: Notification[]
  loading: boolean
  lastUpdated: string | null
  searchQuery: string
  sidebarCollapsed: boolean
}

const initialState: DashboardState = {
  stats: {
    totalBanners: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalTeamMembers: 0,
    totalTestimonials: 0,
    totalGalleryItems: 0,
    totalContacts: 0,
    pageViews: 0,
    totalVisitors: 0,
    bounceRate: 0,
    avgSessionDuration: "0:00",
  },
  recentActivity: [],
  notifications: [],
  loading: false,
  lastUpdated: null,
  searchQuery: "",
  sidebarCollapsed: false,
}

// Async thunk for fetching real-time stats
export const fetchDashboardStats = createAsyncThunk("dashboard/fetchStats", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("auth-token")
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }

    const [statsRes, analyticsRes] = await Promise.all([
      fetch("/api/dashboard/stats", { headers }),
      fetch("/api/analytics", { headers }),
    ])

    const [stats, analytics] = await Promise.all([statsRes.json(), analyticsRes.json()])

    return { stats: stats.data, analytics: analytics.data }
  } catch (error) {
    return rejectWithValue("Failed to fetch dashboard stats")
  }
})

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setStats: (state, action: PayloadAction<DashboardStats>) => {
      state.stats = action.payload
      state.lastUpdated = new Date().toISOString()
    },
    setRecentActivity: (state, action: PayloadAction<RecentActivity[]>) => {
      state.recentActivity = action.payload
    },
    addRecentActivity: (state, action: PayloadAction<RecentActivity>) => {
      state.recentActivity.unshift(action.payload)
      if (state.recentActivity.length > 10) {
        state.recentActivity = state.recentActivity.slice(0, 10)
      }
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload)
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((notification) => {
        notification.read = true
      })
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    updatePageViews: (state) => {
      state.stats.pageViews += 1
    },
    updateVisitors: (state) => {
      state.stats.totalVisitors += 1
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = { ...state.stats, ...action.payload.stats }
        if (action.payload.analytics) {
          state.stats.pageViews = action.payload.analytics.pageViews
          state.stats.totalVisitors = action.payload.analytics.uniqueVisitors
          state.stats.bounceRate = action.payload.analytics.bounceRate
          state.stats.avgSessionDuration = action.payload.analytics.avgSessionDuration
        }
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchDashboardStats.rejected, (state) => {
        state.loading = false
      })
  },
})

export const {
  setStats,
  setRecentActivity,
  addRecentActivity,
  setNotifications,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setLoading,
  setSearchQuery,
  toggleSidebar,
  setSidebarCollapsed,
  updatePageViews,
  updateVisitors,

} = dashboardSlice.actions

export default dashboardSlice.reducer
