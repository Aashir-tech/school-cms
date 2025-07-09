import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse, validateRequiredFields } from "@/lib/api-helpers"

/**
 * GET /api/banners
 * Fetch all banners ordered by display order
 */
export async function GET() {
  try {
    const db = await getDatabase()
    const bannersCollection = db.collection("banners")

    const banners = await bannersCollection.find({}).sort({ order: 1 }).toArray()

    return createApiResponse(true, banners, "Banners fetched successfully")
  } catch (error) {
    console.error("Error fetching banners:", error)
    return createErrorResponse("Failed to fetch banners", 500)
  }
}

/**
 * POST /api/banners
 * Create a new banner
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const bannerData = await request.json()

    // Validate required fields
    const validationError = validateRequiredFields(bannerData, ["image", "heading", "subheading", "order"])
    if (validationError) {
      return createErrorResponse(validationError, 400)
    }

    const db = await getDatabase()
    const bannersCollection = db.collection("banners")

    const newBanner = {
      ...bannerData,
      isActive: bannerData.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.userId,
    }

    const result = await bannersCollection.insertOne(newBanner)

    return createApiResponse(true, { ...newBanner, _id: result.insertedId }, "Banner created successfully")
  } catch (error) {
    console.error("Error creating banner:", error)
    return createErrorResponse("Failed to create banner", 500)
  }
}
