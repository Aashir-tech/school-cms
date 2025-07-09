/**
 * Authentication API Route
 * Handles user login with improved error handling
 */
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { generateToken } from "@/lib/auth"
import clientPromise from "@/lib/mongo-db"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("school-cms")
    const users = db.collection("users")

    // Find user by email
    const user = await users.findOne({ email: email.toLowerCase() })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: "Account is deactivated" }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    })

    // Update last login
    await users.updateOne(
      { _id: user._id },
      {
        $set: { lastLogin: new Date() },
        $currentDate: { updatedAt: true },
      },
    )

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
