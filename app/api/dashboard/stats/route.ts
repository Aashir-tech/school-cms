import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  try {
    await authenticateRequest(request)

    const db = await getDatabase()

    // Get counts from all collections
    const [bannersCount, eventsCount, teamCount, testimonialsCount, galleryCount, contactsCount] = await Promise.all([
      db.collection("banners").countDocuments({ isActive: true }),
      db.collection("events").countDocuments(),
      db.collection("team").countDocuments({ isActive: true }),
      db.collection("testimonials").countDocuments({ isActive: true }),
      db.collection("gallery").countDocuments({ isActive: true }),
      db.collection("contacts").countDocuments(),
    ])

    // Get upcoming events
    const now = new Date()
    const upcomingEvents = await db.collection("events").countDocuments({
      date: { $gte: now },
      isActive: true,
    })

    const stats = {
      totalBanners: bannersCount,
      totalEvents: eventsCount,
      upcomingEvents,
      totalTeamMembers: teamCount,
      totalTestimonials: testimonialsCount,
      totalGalleryItems: galleryCount,
      totalContacts: contactsCount,
    }

    return createApiResponse(true, stats, "Dashboard stats fetched successfully")
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return createErrorResponse("Failed to fetch dashboard stats", 500)
  }
}
