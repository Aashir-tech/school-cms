/**
 * Team API Routes
 * Handle CRUD operations for team members
 */
import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse, validateRequiredFields } from "@/lib/api-helpers"

/**
 * GET /api/team
 * Fetch all team members ordered by display order
 */
export async function GET() {
  try {
    const db = await getDatabase()
    const teamCollection = db.collection("team")

    const teamMembers = await teamCollection.find({}).sort({ order: 1 }).toArray()

    return createApiResponse(true, teamMembers, "Team members fetched successfully")
  } catch (error) {
    console.error("Error fetching team members:", error)
    return createErrorResponse("Failed to fetch team members", 500)
  }
}

/**
 * POST /api/team
 * Create a new team member
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const memberData = await request.json()

    // Validate required fields
    const validationError = validateRequiredFields(memberData, ["name", "designation", "photo", "order"])
    if (validationError) {
      return createErrorResponse(validationError, 400)
    }

    const db = await getDatabase()
    const teamCollection = db.collection("team")

    const newMember = {
      ...memberData,
      socialLinks: memberData.socialLinks || {},
      isActive: memberData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.userId,
    }

    const result = await teamCollection.insertOne(newMember)

    return createApiResponse(true, { ...newMember, _id: result.insertedId }, "Team member created successfully")
  } catch (error) {
    console.error("Error creating team member:", error)
    return createErrorResponse("Failed to create team member", 500)
  }
}
