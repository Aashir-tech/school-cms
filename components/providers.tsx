"use client"

/**
 * App Providers Component
 * Redux provider with auth initialization
 */
import type React from "react"
import { useEffect } from "react"
import { Provider, useDispatch } from "react-redux"
import { store } from "@/redux/store"
import { initializeAuth } from "@/redux/slices/authSlice"

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAuth())
  }, [dispatch])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>{children}</AuthInitializer>
    </Provider>
  )
}
