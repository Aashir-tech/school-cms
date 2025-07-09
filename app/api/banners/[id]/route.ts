/**
 * Banner API Routes - Individual Banner Operations
 * Handle update and delete operations for specific banners
 */
import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

/**
 * PUT /api/banners/[id]
 * Update a specific banner
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const { id } = params
    const bannerData = await request.json()

    if (!ObjectId.isValid(id)) {
      return createErrorResponse("Invalid banner ID", 400)
    }

    const db = await getDatabase()
    const bannersCollection = db.collection("banners")

    const updateData = {
      ...bannerData,
      updatedAt: new Date(),
      updatedBy: user.userId,
    }

    const result = await bannersCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return createErrorResponse("Banner not found", 404)
    }

    return createApiResponse(true, { id, ...updateData }, "Banner updated successfully")
  } catch (error) {
    console.error("Error updating banner:", error)
    return createErrorResponse("Failed to update banner", 500)
  }
}

/**
 * DELETE /api/banners/[id]
 * Delete a specific banner
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return createErrorResponse("Invalid banner ID", 400)
    }

    const db = await getDatabase()
    const bannersCollection = db.collection("banners")

    const result = await bannersCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return createErrorResponse("Banner not found", 404)
    }

    return createApiResponse(true, null, "Banner deleted successfully")
  } catch (error) {
    console.error("Error deleting banner:", error)
    return createErrorResponse("Failed to delete banner", 500)
  }
}
