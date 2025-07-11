import type { NextRequest } from "next/server"
import { authenticateRequest, createApiResponse, createErrorResponse } from "@/lib/api-helpers"
import cloudinary from "@/lib/cloudinary"

async function countAllResources(folder: string, resourceType: string = "image") {
    let total = 0
    let nextCursor: string | undefined = undefined
  
    do {
      const result = await cloudinary.api.resources({
        type: "upload",
        resource_type: resourceType,
        prefix: folder,
        max_results: 200, // Max allowed by Cloudinary
        next_cursor: nextCursor,
      })
  
      total += result.resources.length
      nextCursor = result.next_cursor
    } while (nextCursor)
  
    return total
  }
  

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const folder = searchParams.get("folder") || ""
    const resourceType = searchParams.get("resource_type") || "image"

    const cursor = searchParams.get("cursor") || undefined

    const totalCount = await countAllResources(folder, resourceType);
    console.log("Total COunt" , totalCount);

    // Fetch resources from Cloudinary
    const result = await cloudinary.api.resources({
      type: "upload",
      resource_type: resourceType,
      prefix: folder,
      max_results: limit,
      next_cursor: cursor, // Cloudinary uses cursor-based pagination
      sort_by: [["created_at", "desc"]],
    })

    // console.log("Result Total ", result);
    // const totalFiles = result.resources.length

    // console.log("Result Total" , result.resources.length);
    // console.log("Result Total" , result.total_count);

    // Transform the data to match your expected format
    const transformedData = result.resources.map((resource: any) => ({
      public_id: resource.public_id,
      url: resource.secure_url,
      format: resource.format,
      size: resource.bytes,
      width: resource.width,
      height: resource.height,
      created_at: resource.created_at,
      folder: resource.folder || "",
      filename: resource.filename || resource.public_id.split("/").pop()
    }))

    const pagination = {
      page,
      limit,
      total: totalCount || 0,
      pages: Math.ceil((totalCount || 0) / limit),
      hasNext: !!result.next_cursor,
      hasPrev: page > 1,
      nextCursor: result.next_cursor || null,
    }

    console.log("Pagination" , pagination);

    return createApiResponse(true, transformedData, "Media files fetched successfully", pagination)
  } catch (error) {
    console.error("Error fetching media files:", error)
    return createErrorResponse("Failed to fetch media files", 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await authenticateRequest(request)
    const body = await request.json()
    const { public_id, public_ids } = body

    if (!public_id && !public_ids) {
      return createErrorResponse("public_id or public_ids array is required")
    }

    let result
    if (public_ids && Array.isArray(public_ids)) {
      // Bulk delete
      result = await cloudinary.api.delete_resources(public_ids)
    } else {
      // Single delete
      result = await cloudinary.uploader.destroy(public_id)
    }

    return createApiResponse(true, result, "Media file(s) deleted successfully")
  } catch (error) {
    console.error("Error deleting media file:", error)
    return createErrorResponse(error instanceof Error ? error.message : "Failed to delete media file", 500)
  }
}