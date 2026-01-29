import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { logAuditEvent } from "@/lib/actions";
import { Prisma } from "@/lib/generated/prisma/client";
import * as runtime from "@prisma/client/runtime/client";

/**
 * GET /api/configuration
 * Get all configuration settings
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const configurations = await db.configuration.findMany({
      orderBy: { category: "asc" }
    });

    // Transform the data for easier consumption
    const configMap = configurations.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, Prisma.JsonValue>);

    return NextResponse.json({
      configurations: configMap,
      metadata: configurations.map(config => ({
        id: config.id,
        key: config.key,
        description: config.description,
        category: config.category,
        isSystem: config.isSystem,
        updatedAt: config.updatedAt
      }))
    });
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/configuration
 * Update configuration settings
 */
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { configurations } = body;

    if (!configurations || typeof configurations !== "object") {
      return NextResponse.json({ error: "Invalid configuration data" }, { status: 400 });
    }

    // Update or create configurations
    const updates = Object.entries(configurations).map(async ([key, value]) => {
      return db.configuration.upsert({
        where: { key },
        update: {
          value: value as runtime.InputJsonValue,
          updatedAt: new Date()
        },
        create: {
          key,
          value: value as runtime.InputJsonValue,
          category: getCategoryForKey(key),
          description: getDescriptionForKey(key)
        }
      });
    });

    await Promise.all(updates);

    // Log the configuration change
    await logAuditEvent(user.id, "UPDATE", "Configuration", "system", "Updated system configuration");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating configuration:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Helper function to determine category for a configuration key
 */
function getCategoryForKey(key: string): string {
  if (key.startsWith("categories.")) return "categories";
  if (key.startsWith("retention.")) return "retention";
  if (key.startsWith("system.")) return "system";
  return "general";
}

/**
 * Helper function to get description for a configuration key
 */
function getDescriptionForKey(key: string): string | undefined {
  const descriptions: Record<string, string> = {
    "categories.complaint": "Available categories for complaints",
    "categories.suggestion": "Available categories for suggestions",
    "retention.years": "Number of years to retain data",
    "system.maxFileSize": "Maximum file size for uploads (MB)",
    "system.supportEmail": "Support email address"
  };

  return descriptions[key];
}