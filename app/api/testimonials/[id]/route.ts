import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const collection = db.collection("testimonials")

    const testimonial = await collection.findOne({ _id: new ObjectId(params.id) })

    if (!testimonial) {
      return createErrorResponse("Testimonial not found", 404)
    }

    return createApiResponse(true, testimonial, "Testimonial fetched successfully")
  } catch (error) {
    console.error("Error fetching testimonial:", error)
    return createErrorResponse("Failed to fetch testimonial", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)
    const body = await request.json()

    const { name, role, company, quote, rating, image, isActive, isFeatured } = body

    if (!name || !quote || !rating) {
      return createErrorResponse("Name, quote, and rating are required")
    }

    const db = await getDatabase()
    const collection = db.collection("testimonials")

    const updateData = {
      name,
      role: role || "",
      company: company || "",
      quote,
      rating: Number.parseInt(rating) || 5,
      image: image || "",
      isActive: isActive !== false,
      isFeatured: isFeatured === true,
      updatedAt: new Date(),
    }

    const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return createErrorResponse("Testimonial not found", 404)
    }

    return createApiResponse(true, updateData, "Testimonial updated successfully")
  } catch (error) {
    console.error("Error updating testimonial:", error)
    return createErrorResponse(error instanceof Error ? error.message : "Failed to update testimonial", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)

    const db = await getDatabase()
    const collection = db.collection("testimonials")

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return createErrorResponse("Testimonial not found", 404)
    }

    return createApiResponse(true, null, "Testimonial deleted successfully")
  } catch (error) {
    console.error("Error deleting testimonial:", error)
    return createErrorResponse(error instanceof Error ? error.message : "Failed to delete testimonial", 500)
  }
}
