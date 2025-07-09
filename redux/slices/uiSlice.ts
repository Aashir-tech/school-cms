import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UIState {
  theme: "light" | "dark" | "system"
  sidebarOpen: boolean
  loading: boolean
  notifications: Array<{
    id: string
    type: "success" | "error" | "info" | "warning"
    message: string
    timestamp: number
  }>
}

const initialState: UIState = {
  theme: "system",
  sidebarOpen: true,
  loading: false,
  notifications: [],
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<UIState["theme"]>) => {
      state.theme = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    addNotification: (state, action: PayloadAction<Omit<UIState["notifications"][0], "id" | "timestamp">>) => {
      state.notifications.push({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      })
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload)
    },
  },
})

export const { setTheme, toggleSidebar, setSidebarOpen, setLoading, addNotification, removeNotification } =
  uiSlice.actions

export default uiSlice.reducer
