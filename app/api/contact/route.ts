import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

export async function GET() {
  try {
    const db = await getDatabase()
    const contactsCollection = db.collection("contacts")

    const contacts = await contactsCollection.find({}).sort({ createdAt: -1 }).toArray()

    return createApiResponse(true, contacts, "Contact messages fetched successfully")
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return createErrorResponse("Failed to fetch contact messages", 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json()

    const db = await getDatabase()
    const contactsCollection = db.collection("contacts")

    const newContact = {
      ...contactData,
      isRead: false,
      createdAt: new Date(),
    }

    const result = await contactsCollection.insertOne(newContact)

    // Emit real-time notification (you can implement WebSocket here)
    // For now, we'll just return success

    return createApiResponse(true, { id: result.insertedId, ...newContact }, "Contact message submitted successfully")
  } catch (error) {
    console.error("Error creating contact:", error)
    return createErrorResponse("Failed to submit contact message", 500)
  }
}
