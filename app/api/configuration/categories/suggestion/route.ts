import { NextRequest, NextResponse } from "next/server";
import { getSuggestionCategories } from "@/lib/config";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/actions";

/**
 * GET /api/configuration/categories/suggestion
 * Get available suggestion categories
 */
export async function GET() {
  try {
    const categories = await getSuggestionCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error fetching suggestion categories:", error);
    return NextResponse.json(
      { error: "Internal server error", categories: ["Facilities", "IT Support", "Academic", "Administrative"] },
      { status: 500 }
    );
  }
}

/**
 * POST /api/configuration/categories/suggestion
 * Add a new suggestion category (Admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { category } = await request.json();

    if (!category || typeof category !== "string" || !category.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    // Get current categories
    const currentCategories = await getSuggestionCategories();

    // Check if category already exists
    if (currentCategories.includes(category.trim())) {
      return NextResponse.json({ error: "Category already exists" }, { status: 400 });
    }

    // Add new category
    const updatedCategories = [...currentCategories, category.trim()];

    // Update configuration via the main config API
    const configResponse = await fetch(`${request.nextUrl.origin}/api/configuration`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward the authorization header
        "Authorization": request.headers.get("authorization") || "",
      },
      body: JSON.stringify({
        configurations: {
          "categories.suggestion": updatedCategories
        }
      }),
    });

    if (!configResponse.ok) {
      throw new Error("Failed to update configuration");
    }

    // Log the action
    await logAuditEvent(user.id, "CREATE", "Configuration", "categories.suggestion", `Added category: ${category.trim()}`);

    return NextResponse.json({
      success: true,
      categories: updatedCategories
    });
  } catch (error) {
    console.error("Error adding suggestion category:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}