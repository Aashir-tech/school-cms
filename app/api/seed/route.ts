// app/api/seed/route.ts
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const { seedDatabase } = await import("@/lib/seed-database.js") 
    await seedDatabase()

    return NextResponse.json({ success: true, message: "Seeding complete" })
  } catch (err) {
    console.error("Seeding error:", err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
