/**
 * Testimonials API Routes
 * Handle CRUD operations for testimonials
 */
import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse, validateRequiredFields } from "@/lib/api-helpers"

/**
 * GET /api/testimonials
 * Fetch all testimonials
 */
export async function GET() {
  try {
    const db = await getDatabase()
    const testimonialsCollection = db.collection("testimonials")

    const testimonials = await testimonialsCollection.find({}).sort({ createdAt: -1 }).toArray()

    return createApiResponse(true, testimonials, "Testimonials fetched successfully")
  } catch (error) {
    console.error("Error fetching testimonials:", error)
    return createErrorResponse("Failed to fetch testimonials", 500)
  }
}

/**
 * POST /api/testimonials
 * Create a new testimonial
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const user = await authenticateRequest(request)

    const testimonialData = await request.json()

    // Validate required fields
    const validationError = validateRequiredFields(testimonialData, ["name", "quote"])
    if (validationError) {
      return createErrorResponse(validationError, 400)
    }

    const db = await getDatabase()
    const testimonialsCollection = db.collection("testimonials")

    const newTestimonial = {
      ...testimonialData,
      rating: testimonialData.rating || 5,
      isActive: testimonialData.isActive ?? true,
      isFeatured: testimonialData.isFeatured ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: user.userId,
    }

    const result = await testimonialsCollection.insertOne(newTestimonial)

    return createApiResponse(true, { ...newTestimonial, _id: result.insertedId }, "Testimonial created successfully")
  } catch (error) {
    console.error("Error creating testimonial:", error)
    return createErrorResponse("Failed to create testimonial", 500)
  }
}
