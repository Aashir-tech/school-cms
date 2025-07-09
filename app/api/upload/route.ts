import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const filename = file.name.replace(/\.[^/.]+$/, "") + "-" + uniqueSuffix + path.extname(file.name)
    const filepath = path.join(process.cwd(), "public/uploads", filename)

    await writeFile(filepath, buffer)

    return NextResponse.json({
      url: `/uploads/${filename}`,
      filename,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
