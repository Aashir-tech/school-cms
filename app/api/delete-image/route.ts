import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const { public_id } = await request.json();

    if (!public_id) {
      return NextResponse.json({ error: "Missing public_id" }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json({ error: "Image deletion failed" }, { status: 500 });
  }
}
