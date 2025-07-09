"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Generate session ID if not exists
    let sessionId = sessionStorage.getItem("session-id")
    if (!sessionId) {
      sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem("session-id", sessionId)
    }

    // Track page view
    const trackPageView = async () => {
      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "pageview",
            sessionId,
            userAgent: navigator.userAgent,
            ip: "visitor", // In production, you'd get the real IP
            pathname,
          }),
        })
      } catch (error) {
        console.error("Failed to track page view:", error)
      }
    }

    trackPageView()
  }, [pathname])

  return null
}
