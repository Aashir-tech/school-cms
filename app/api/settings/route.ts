import type { NextRequest } from "next/server"
import { getDatabase } from "@/lib/mongo-db"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()
    const settingsCollection = db.collection("settings")

    const settings = await settingsCollection.findOne({ type: "site" })

    return createApiResponse(true, settings || {}, "Settings fetched successfully")
  } catch (error) {
    console.error("Error fetching settings:", error)
    return createErrorResponse("Failed to fetch settings", 500)
  }
}

export async function PUT(request: NextRequest) {
  try {
    await authenticateRequest(request)

    const settingsData = await request.json()

    // ✅ Prevent MongoDB _id mutation
    const { _id, ...safeSettingsData } = settingsData

    const db = await getDatabase()
    const settingsCollection = db.collection("settings")

    const updatedSettings = {
      type: "site",
      ...safeSettingsData,
      updatedAt: new Date(),
    }

    // ✅ Safer: update without replacing _id
    await settingsCollection.updateOne(
      { type: "site" },
      { $set: updatedSettings },
      { upsert: true }
    )

    return createApiResponse(true, updatedSettings, "Settings updated successfully")
  } catch (error) {
    console.error("Error updating settings:", error)
    return createErrorResponse("Failed to update settings", 500)
  }
}
