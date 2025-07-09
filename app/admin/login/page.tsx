"use client"

import type React from "react"

/**
 * Admin Login Page
 * Enhanced login form with better UX
 */
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Eye, EyeOff, LogIn, School } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { RootState } from "@/redux/store"
import { loginUser, restoreAuthState } from "@/redux/slices/authSlice"

export default function AdminLoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { loading, error, isAuthenticated, initialized } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    email: "admin@school.edu", // Pre-filled for demo
    password: "admin123", // Pre-filled for demo
  })
  const [showPassword, setShowPassword] = useState(false)

  // Check if already authenticated
  useEffect(() => {
    if (!initialized) {
      dispatch(restoreAuthState() as any)
    }
  }, [dispatch, initialized])

  useEffect(() => {
    if (initialized && isAuthenticated) {
      console.log("Already authenticated, redirecting to dashboard...")
      router.replace("/admin")
    }
  }, [initialized, isAuthenticated, router])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt with:", formData.email)

    try {
      const result = await dispatch(loginUser(formData) as any)

      if (loginUser.fulfilled.match(result)) {
        console.log("Login successful, redirecting...")
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard!",
        })
        router.replace("/admin")
      } else {
        console.log("Login failed:", result.payload)
        toast({
          title: "Login failed",
          description: (result.payload as string) || "Invalid credentials",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
      })
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Don't render if already authenticated
  if (initialized && isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <School className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Admin Login</CardTitle>
          <p className="text-gray-600">Sign in to access the admin dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
                className="mt-1"
              />
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Demo Credentials Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-600">
                <strong>Demo Credentials:</strong>
                <br />
                Email: admin@school.edu
                <br />
                Password: admin123
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
