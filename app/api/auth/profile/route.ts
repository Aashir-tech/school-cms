/**
 * Profile API Route
 * Handle profile updates
 */
import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    const { name, email } = await request.json()

    if (!name || !email) {
      return createErrorResponse("Name and email are required", 400)
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Check if email is already taken by another user
    const existingUser = await usersCollection.findOne({
      email: email.toLowerCase(),
      _id: { $ne: new ObjectId(user.userId) },
    })

    if (existingUser) {
      return createErrorResponse("Email is already taken", 400)
    }

    // Update user profile
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          name,
          email: email.toLowerCase(),
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return createErrorResponse("User not found", 404)
    }

    // Get updated user
    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(user.userId) })

    return createApiResponse(
      true,
      {
        user: {
          id: updatedUser?._id.toString(),
          email: updatedUser?.email,
          name: updatedUser?.name,
          role: updatedUser?.role,
          createdAt: updatedUser?.createdAt,
          lastLogin: updatedUser?.lastLogin,
        },
      },
      "Profile updated successfully",
    )
  } catch (error) {
    console.error("Profile update error:", error)
    return createErrorResponse("Failed to update profile", 500)
  }
}
