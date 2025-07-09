import type { NextRequest } from "next/server"
import { ObjectId } from "mongodb"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)

    const db = await getDatabase()
    const collection = db.collection("contacts")

    const contact = await collection.findOne({ _id: new ObjectId(params.id) })

    if (!contact) {
      return createErrorResponse("Contact message not found", 404)
    }

    return createApiResponse(true, contact, "Contact message fetched successfully")
  } catch (error) {
    console.error("Error fetching contact message:", error)
    return createErrorResponse(error instanceof Error ? error.message : "Failed to fetch contact message", 500)
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)
    const body = await request.json()

    const db = await getDatabase()
    const collection = db.collection("contacts")

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    const result = await collection.updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return createErrorResponse("Contact message not found", 404)
    }

    return createApiResponse(true, updateData, "Contact message updated successfully")
  } catch (error) {
    console.error("Error updating contact message:", error)
    return createErrorResponse(error instanceof Error ? error.message : "Failed to update contact message", 500)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await authenticateRequest(request)

    const db = await getDatabase()
    const collection = db.collection("contacts")

    const result = await collection.deleteOne({ _id: new ObjectId(params.id) })

    if (result.deletedCount === 0) {
      return createErrorResponse("Contact message not found", 404)
    }

    return createApiResponse(true, null, "Contact message deleted successfully")
  } catch (error) {
    console.error("Error deleting contact message:", error)
    return createErrorResponse(error instanceof Error ? error.message : "Failed to delete contact message", 500)
  }
}
