import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

interface Session {
    sessionId: string
    visitorId: string
    startTime: Date
    lastActivity: Date
    pageViews: number
    duration: number
  }
  
  interface AnalyticsData {
    date: Date
    pageViews: number
    uniqueVisitors: number
    sessions: Session[]
    visitors: String[]
    bounceRate?: number
    avgSessionDuration?: string
  }

export async function GET(request: NextRequest) {
  try {
    await authenticateRequest(request)

    const db = await getDatabase()
    const analyticsCollection = db.collection("analytics")

    // Get today's analytics
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const analytics = await analyticsCollection.findOne<AnalyticsData>({
      date: today,
    })

    if (!analytics) {
      // Create initial analytics record
      const initialAnalytics : AnalyticsData = {
        date: today,
        pageViews: 0,
        uniqueVisitors: 0,
        visitors: [],
        sessions: [],
        bounceRate: 0,
        avgSessionDuration: "0:00",
      }

      await analyticsCollection.insertOne(initialAnalytics)
      return createApiResponse(true, initialAnalytics, "Analytics data initialized")
    }

    // Calculate bounce rate and average session duration
    const sessions = analytics.sessions || []
    const totalSessions = sessions.length
    const bouncedSessions = sessions.filter((session: any) => session.pageViews === 1).length
    const bounceRate = totalSessions > 0 ? Math.round((bouncedSessions / totalSessions) * 100) : 0

    // Calculate average session duration
    const totalDuration = sessions.reduce((sum: number, session: any) => sum + (session.duration || 0), 0)
    const avgDurationMs = totalSessions > 0 ? totalDuration / totalSessions : 0
    const avgMinutes = Math.floor(avgDurationMs / 60000)
    const avgSeconds = Math.floor((avgDurationMs % 60000) / 1000)
    const avgSessionDuration = `${avgMinutes}:${avgSeconds.toString().padStart(2, "0")}`

    const result = {
      pageViews: analytics.pageViews || 0,
      uniqueVisitors: analytics.uniqueVisitors || 0,
      bounceRate,
      avgSessionDuration,
    }

    return createApiResponse(true, result, "Analytics data fetched successfully")
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return createErrorResponse("Failed to fetch analytics", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, sessionId, userAgent, ip } = await request.json()

    const db = await getDatabase()
    const analyticsCollection = db.collection("analytics")

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let analytics = await analyticsCollection.findOne<AnalyticsData>({ date: today })

    if (!analytics) {
        // @ts-ignore
      analytics = {
        date: today,
        pageViews: 0,
        uniqueVisitors: 0,
        sessions: [],
        visitors: [],
      }
    }

    const visitorId = `${ip}-${userAgent}`

    if (action === "pageview") {
      // Increment page views
      analytics.pageViews = (analytics.pageViews || 0) + 1

      // Check if this is a unique visitor
      if (!analytics.visitors.includes(visitorId)) {
        analytics.visitors.push(visitorId)
        analytics.uniqueVisitors = analytics.visitors.length
      }

      // Update or create session
      let session = analytics.sessions.find((s: any) => s.sessionId === sessionId)
      if (!session) {
        session = {
          sessionId,
          visitorId,
          startTime: new Date(),
          lastActivity: new Date(),
          pageViews: 0,
          duration: 0,
        }
        analytics.sessions.push(session)
      }

      session.pageViews += 1
      session.lastActivity = new Date()
      session.duration = new Date().getTime() - new Date(session.startTime).getTime()

      await analyticsCollection.replaceOne({ date: today }, analytics, { upsert: true })
    }

    return createApiResponse(true, null, "Analytics updated successfully")
  } catch (error) {
    console.error("Error updating analytics:", error)
    return createErrorResponse("Failed to update analytics", 500)
  }
}
