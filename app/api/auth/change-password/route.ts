/**
 * Change Password API Route
 * Handle password changes
 */
import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return createErrorResponse("Current password and new password are required", 400)
    }

    if (newPassword.length < 6) {
      return createErrorResponse("New password must be at least 6 characters", 400)
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // Get current user
    const currentUser = await usersCollection.findOne({ _id: new ObjectId(user.userId) })

    if (!currentUser) {
      return createErrorResponse("User not found", 404)
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password)

    if (!isCurrentPasswordValid) {
      return createErrorResponse("Current password is incorrect", 400)
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      {
        $set: {
          password: hashedNewPassword,
          updatedAt: new Date(),
        },
      },
    )

    return createApiResponse(true, null, "Password changed successfully")
  } catch (error) {
    console.error("Password change error:", error)
    return createErrorResponse("Failed to change password", 500)
  }
}
