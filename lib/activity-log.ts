import { prisma } from "@/lib/prisma";
import type { ActivityType } from "@/types/enums";
import type { ActivityMetadata } from "@/types/activity-log";
import type { InputJsonValue } from "@prisma/client/runtime/library";

interface LogActivityParams {
  userId?: string | null;
  activityType: ActivityType;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: ActivityMetadata | null;
  ipAddress?: string;
  userAgent?: string;
}

export async function logActivity({
  userId,
  activityType,
  entityType,
  entityId,
  description,
  metadata,
  ipAddress,
  userAgent,
}: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId === "system" ? null : userId,
        activityType,
        entityType,
        entityId,
        description,
        metadata: metadata as InputJsonValue,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw error to avoid breaking the main operation
  }
}

export async function logActivityFromRequest(
  request: Request,
  params: Omit<LogActivityParams, "ipAddress" | "userAgent">
) {
  // Get IP address from request headers
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const ipAddress = forwarded?.split(",")[0]?.trim() || realIp || "unknown";

  // Get user agent from request
  const userAgent = request.headers.get("user-agent") || "unknown";

  await logActivity({
    ...params,
    ipAddress,
    userAgent,
  });
}
