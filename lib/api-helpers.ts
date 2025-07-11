/**
 * API Helper Functions
 * Common utilities for API routes and data handling
 */
import { NextResponse } from "next/server"
import { verifyToken } from "./auth"
import type { NextRequest } from "next/server"

// Only import MongoDB on server side
let getDatabase: any = null
if (typeof window === "undefined") {
  getDatabase = require("./mongo-db").getDatabase
}

// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
    nextCursor:any
  }
}

/**
 * Create standardized API response
 */
export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  pagination?: ApiResponse["pagination"],
): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success,
    data,
    message,
    pagination,
  })
}

/**
 * Create error response
 */
export function createErrorResponse(error: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status },
  )
}

/**
 * Authenticate request and return user info
 */
export async function authenticateRequest(request: NextRequest) {
  // Try to get token from Authorization header first
  const authHeader = request.headers.get("authorization")
  let token = authHeader?.replace("Bearer ", "")

  // If no Authorization header, try cookie
  if (!token) {
    token = request.cookies.get("auth-token")?.value
  }

  console.log("Auth header:", authHeader)
  console.log("Token from cookie:", request.cookies.get("auth-token")?.value)
  console.log("Final token:", token)

  if (!token) {
    throw new Error("No authentication token provided")
  }

  const decoded = verifyToken(token)
  if (!decoded || typeof decoded === "string") {
    throw new Error("Invalid authentication token")
  }

  return decoded as { userId: string; email: string; role: string }
}

/**
 * Get paginated results from MongoDB collection (server-side only)
 */
export async function getPaginatedResults(
  collectionName: string,
  page = 1,
  limit = 10,
  filter: any = {},
  sort: any = { createdAt: -1 },
) {
  if (!getDatabase) {
    throw new Error("Database operations can only be performed on the server side")
  }

  const db = await getDatabase()
  const collection = db.collection(collectionName)

  const skip = (page - 1) * limit
  const total = await collection.countDocuments(filter)
  const data = await collection.find(filter).sort(sort).skip(skip).limit(limit).toArray()

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(body: any, requiredFields: string[]): string | null {
  for (const field of requiredFields) {
    if (!body[field]) {
      return `${field} is required`
    }
  }
  return null
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove < and > characters
    .trim()
}

/**
 * Generate unique filename for uploads
 */
export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.round(Math.random() * 1e9)
  const extension = originalName.split(".").pop()
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, "")

  return `${nameWithoutExt}-${timestamp}-${random}.${extension}`
}

/**
 * Create authenticated fetch function that includes auth token (client-side only)
 */
export function createAuthenticatedFetch() {
  if (typeof window === "undefined") {
    throw new Error("createAuthenticatedFetch can only be used on the client side")
  }

  return async (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("auth-token")

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      // @ts-ignore
      headers["Authorization"] = `Bearer ${token}`
    }

    return fetch(url, {
      ...options,
      headers,
    })
  }
}
