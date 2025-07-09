import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDatabase()
    const collection = db.collection("gallery")

    const galleryItem = await collection.findOne({ _id: new ObjectId(params.id) })

    if (!galleryItem) {
      return createErrorResponse("Gallery item not found", 404)
    }

    return createApiResponse(true, galleryItem, "Gallery item fetched successfully")
  } catch (error) {
    console.error("Error fetching gallery item:", error)
    return createErrorResponse("Failed to fetch gallery item", 500)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)
    const body = await request.json()

    const { url, alt, title, description, category, order, isActive } = body

    if (!url || !alt || !category) {
      return createErrorResponse("URL, alt text, and category are required")
    }

    const db = await getDatabase()
    const collection = db.collection("gallery")

    const updateData = {
      url,
      alt,
      title: title || "",
      description: description || "",
      category,
      order: Number.parseInt(order) || 1,
      isActive: isActive !== false,
      updatedAt: new Date(),
    }

    const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return createErrorResponse("Gallery item not found", 404)
    }

    return createApiResponse(true, updateData, "Gallery item updated successfully")
  } catch (error) {
    console.error("Error updating gallery item:", error)
    return createErrorResponse(error instanceof Error ? error.message : "Failed to update gallery item", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)

    const db = await getDatabase()
    const collection = db.collection("gallery")

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return createErrorResponse("Gallery item not found", 404)
    }

    return createApiResponse(true, null, "Gallery item deleted successfully")
  } catch (error) {
    console.error("Error deleting gallery item:", error)
    return createErrorResponse(error instanceof Error ? error.message : "Failed to delete gallery item", 500)
  }
}
