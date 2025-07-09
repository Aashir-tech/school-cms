import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse, getPaginatedResults } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const isActive = searchParams.get("isActive")

    const filter: any = {}
    if (category) filter.category = category
    if (isActive !== null) filter.isActive = isActive === "true"

    const result = await getPaginatedResults("gallery", page, limit, filter, { order: 1, createdAt: -1 })

    return createApiResponse(true, result.data, "Gallery items fetched successfully", result.pagination)
  } catch (error) {
    console.error("Error fetching gallery items:", error)
    return createErrorResponse("Failed to fetch gallery items", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    await authenticateRequest(request)
    const body = await request.json()

    const { url, alt, title, description, category, order, isActive } = body

    if (!url || !alt || !category) {
      return createErrorResponse("URL, alt text, and category are required")
    }

    const db = await getDatabase()
    const collection = db.collection("gallery")

    const galleryItem = {
      url,
      alt,
      title: title || "",
      description: description || "",
      category,
      order: Number.parseInt(order) || 1,
      isActive: isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(galleryItem)

    return createApiResponse(true, { _id: result.insertedId, ...galleryItem }, "Gallery item created successfully")
  } catch (error) {
    console.error("Error creating gallery item:", error)
    return createErrorResponse(error instanceof Error ? error.message : "Failed to create gallery item", 500)
  }
}
