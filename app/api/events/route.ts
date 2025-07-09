import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import {
  authenticateRequest,
  createApiResponse,
  createErrorResponse,
  getPaginatedResults,
  validateRequiredFields,
} from "@/lib/api-helpers"

/**
 * GET /api/events
 * Fetch events with pagination and search
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""

    // Build search filter
    let filter: any = {}
    if (search) {
      filter = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      }
    }

    const result = await getPaginatedResults("events", page, limit, filter, { date: -1 })

    return createApiResponse(true, result.data, "Events fetched successfully", result.pagination)
  } catch (error) {
    console.error("Error fetching events:", error)
    return createErrorResponse("Failed to fetch events", 500)
  }
}

/**
 * POST /api/events
 * Create a new event
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const eventData = await request.json()

    // Validate required fields
    const validationError = validateRequiredFields(eventData, ["title", "description", "date"])
    if (validationError) {
      return createErrorResponse(validationError, 400)
    }

    const db = await getDatabase()
    const eventsCollection = db.collection("events")

    const newEvent = {
      ...eventData,
      date: new Date(eventData.date),
      endDate: eventData.endDate ? new Date(eventData.endDate) : null,
      isActive: eventData.isActive ?? true,
      isFeatured: eventData.isFeatured ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.userId,
    }

    const result = await eventsCollection.insertOne(newEvent)

    return createApiResponse(true, { ...newEvent, _id: result.insertedId }, "Event created successfully")
  } catch (error) {
    console.error("Error creating event:", error)
    return createErrorResponse("Failed to create event", 500)
  }
}
