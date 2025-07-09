import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  initialized: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  initialized: false,
}

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || "Login failed")
      }

      // Store in localStorage
      localStorage.setItem("auth-token", data.token)
      localStorage.setItem("auth-user", JSON.stringify(data.user))

      return data
    } catch (error) {
      return rejectWithValue("Network error occurred")
    }
  },
)

// Async thunk for restoring auth state
export const restoreAuthState = createAsyncThunk("auth/restoreAuthState", async () => {
  const token = localStorage.getItem("auth-token")
  const userStr = localStorage.getItem("auth-user")

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      return { token, user }
    } catch (error) {
      // Clear invalid data
      localStorage.removeItem("auth-token")
      localStorage.removeItem("auth-user")
      throw new Error("Invalid stored data")
    }
  }

  throw new Error("No stored auth data")
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem("auth-token")
      localStorage.removeItem("auth-user")
    },
    clearError: (state) => {
      state.error = null
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
        localStorage.setItem("auth-user", JSON.stringify(state.user))
      }
    },
    // Add initializeAuth action for backward compatibility
    initializeAuth: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth-token")
        const userStr = localStorage.getItem("auth-user")

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            state.user = user
            state.token = token
            state.isAuthenticated = true
          } catch (error) {
            // Clear invalid data
            localStorage.removeItem("auth-token")
            localStorage.removeItem("auth-user")
            state.isAuthenticated = false
          }
        } else {
          state.isAuthenticated = false
        }
      }
      state.initialized = true
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
        state.initialized = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
        state.initialized = true
      })
      // Restore auth state cases
      .addCase(restoreAuthState.pending, (state) => {
        state.loading = true
      })
      .addCase(restoreAuthState.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.initialized = true
      })
      .addCase(restoreAuthState.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        state.initialized = true
      })
  },
})

export const { logout, clearError, updateUser, initializeAuth } = authSlice.actions
export default authSlice.reducer
