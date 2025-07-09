/**
 * Event API Routes - Individual Event Operations
 * Handle update and delete operations for specific events
 */
import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

/**
 * PUT /api/events/[id]
 * Update a specific event
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const { id } = params
    const eventData = await request.json()

    if (!ObjectId.isValid(id)) {
      return createErrorResponse("Invalid event ID", 400)
    }

    const db = await getDatabase()
    const eventsCollection = db.collection("events")

    const updateData = {
      ...eventData,
      date: new Date(eventData.date),
      endDate: eventData.endDate ? new Date(eventData.endDate) : null,
      updatedAt: new Date(),
      updatedBy: user.userId,
    }

    const result = await eventsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return createErrorResponse("Event not found", 404)
    }

    return createApiResponse(true, { id, ...updateData }, "Event updated successfully")
  } catch (error) {
    console.error("Error updating event:", error)
    return createErrorResponse("Failed to update event", 500)
  }
}

/**
 * DELETE /api/events/[id]
 * Delete a specific event
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return createErrorResponse("Invalid event ID", 400)
    }

    const db = await getDatabase()
    const eventsCollection = db.collection("events")

    const result = await eventsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return createErrorResponse("Event not found", 404)
    }

    return createApiResponse(true, null, "Event deleted successfully")
  } catch (error) {
    console.error("Error deleting event:", error)
    return createErrorResponse("Failed to delete event", 500)
  }
}
