import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";

/**
 * Get a configuration value by key
 */
export async function getConfig(key: string): Promise<Prisma.JsonValue | null> {
  try {
    const config = await db.configuration.findUnique({
      where: { key }
    });
    return config?.value ?? null;
  } catch (error) {
    console.error(`Error getting config for key ${key}:`, error);
    return null;
  }
}

/**
 * Get multiple configuration values
 */
export async function getConfigs(keys: string[]): Promise<Record<string, Prisma.JsonValue>> {
  try {
    const configs = await db.configuration.findMany({
      where: { key: { in: keys } }
    });

    return configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, Prisma.JsonValue>);
  } catch (error) {
    console.error("Error getting configs:", error);
    return {};
  }
}

/**
 * Get all configuration values
 */
export async function getAllConfigs(): Promise<Record<string, Prisma.JsonValue>> {
  try {
    const configs = await db.configuration.findMany();
    return configs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, Prisma.JsonValue>);
  } catch (error) {
    console.error("Error getting all configs:", error);
    return {};
  }
}

/**
 * Get complaint categories
 */
export async function getComplaintCategories(): Promise<string[]> {
  const categories = await getConfig("categories.complaint");
  return Array.isArray(categories) ? categories as string[] : ["Facilities", "IT Support", "Academic", "Administrative"];
}

/**
 * Get suggestion categories
 */
export async function getSuggestionCategories(): Promise<string[]> {
  const categories = await getConfig("categories.suggestion");
  return Array.isArray(categories) ? categories as string[] : ["Facilities", "IT Support", "Academic", "Administrative"];
}

/**
 * Get data retention years
 */
export async function getRetentionYears(): Promise<number> {
  const years = await getConfig("retention.years");
  return typeof years === "number" ? years : 5;
}

/**
 * Get system settings
 */
export async function getSystemSettings(): Promise<{
  maxFileSize: number;
  supportEmail: string;
}> {
  const configs = await getConfigs(["system.maxFileSize", "system.supportEmail"]);

  return {
    maxFileSize: typeof configs["system.maxFileSize"] === "number" ? configs["system.maxFileSize"] : 10,
    supportEmail: typeof configs["system.supportEmail"] === "string" ? configs["system.supportEmail"] : "support@university.edu"
  };
}