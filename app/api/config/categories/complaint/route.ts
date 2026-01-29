import { NextResponse } from "next/server";
import { getComplaintCategories } from "@/lib/config";

/**
 * GET /api/config/categories/complaint
 * Get available complaint categories
 */
export async function GET() {
  try {
    const categories = await getComplaintCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching complaint categories:", error);
    return NextResponse.json(
      { error: "Internal server error", categories: ["Facilities", "IT Support", "Academic", "Administrative"] },
      { status: 500 }
    );
  }
}