// import { type NextRequest, NextResponse } from "next/server"
// import { writeFile } from "fs/promises"
// import path from "path"

// export async function POST(request: NextRequest) {
//   try {
//     const data = await request.formData()
//     const file: File | null = data.get("file") as unknown as File

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
//     }

//     const bytes = await file.arrayBuffer()
//     const buffer = Buffer.from(bytes)

//     // Generate unique filename
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
//     const filename = file.name.replace(/\.[^/.]+$/, "") + "-" + uniqueSuffix + path.extname(file.name)
//     const filepath = path.join(process.cwd(), "public/uploads", filename)

//     await writeFile(filepath, buffer)

//     return NextResponse.json({
//       url: `/uploads/${filename}`,
//       filename,
//     })
//   } catch (error) {
//     console.error("Upload error:", error)
//     return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
//   }
// }


import { type NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "school-cms" },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    console.log(uploadResult)

    // Send only the secure_url and public_id (string)
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    })
  } catch (error) {
    console.error("Cloudinary Upload Error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

