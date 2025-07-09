/**
 * About Us API Routes
 * Handle CRUD operations for About Us content
 */
import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

/**
 * GET /api/about
 * Fetch about us content
 */
export async function GET() {
  try {
    const db = await getDatabase()
    const aboutCollection = db.collection("about")

    // Get the about content (there should only be one document)
    const aboutContent = await aboutCollection.findOne({})

    return createApiResponse(true, aboutContent || { content: "", image: "" })
  } catch (error) {
    console.error("Error fetching about content:", error)
    return createErrorResponse("Failed to fetch about content", 500)
  }
}

/**
 * PUT /api/about
 * Update about us content
 */
export async function PUT(request: NextRequest) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const { content, image } = await request.json()

    if (!content) {
      return createErrorResponse("Content is required", 400)
    }

    const db = await getDatabase()
    const aboutCollection = db.collection("about")

    const updateData = {
      content,
      image: image || "",
      updatedAt: new Date(),
      updatedBy: user.userId,
    }

    // Upsert the about content (update if exists, create if not)
    const result = await aboutCollection.replaceOne({}, updateData, { upsert: true })

    return createApiResponse(true, updateData, "About content updated successfully")
  } catch (error) {
    console.error("Error updating about content:", error)
    return createErrorResponse("Failed to update about content", 500)
  }
}
