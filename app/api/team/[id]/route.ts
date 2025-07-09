/**
 * Team Member API Routes - Individual Operations
 * Handle update and delete operations for specific team members
 */
import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

/**
 * PUT /api/team/[id]
 * Update a specific team member
 */
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const { id } = params
    const memberData = await request.json()

    if (!ObjectId.isValid(id)) {
      return createErrorResponse("Invalid team member ID", 400)
    }

    const db = await getDatabase()
    const teamCollection = db.collection("team")

    const updateData = {
      ...memberData,
      socialLinks: memberData.socialLinks || {},
      updatedAt: new Date(),
      updatedBy: user.userId,
    }

    const result = await teamCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return createErrorResponse("Team member not found", 404)
    }

    return createApiResponse(true, { id, ...updateData }, "Team member updated successfully")
  } catch (error) {
    console.error("Error updating team member:", error)
    return createErrorResponse("Failed to update team member", 500)
  }
}

/**
 * DELETE /api/team/[id]
 * Delete a specific team member
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const { id } = params

    if (!ObjectId.isValid(id)) {
      return createErrorResponse("Invalid team member ID", 400)
    }

    const db = await getDatabase()
    const teamCollection = db.collection("team")

    const result = await teamCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return createErrorResponse("Team member not found", 404)
    }

    return createApiResponse(true, null, "Team member deleted successfully")
  } catch (error) {
    console.error("Error deleting team member:", error)
    return createErrorResponse("Failed to delete team member", 500)
  }
}
