import { ActivityType } from "./enums";

export interface ActivityMetadata {
  // Data tambahan untuk berbagai jenis aktivitas
  oldData?: unknown;
  newData?: unknown;
  details?: Record<string, unknown>;
  url?: string;
  browser?: string;
  os?: string;
  device?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  activityType: ActivityType;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: ActivityMetadata;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  user?: {
    name: string;
    email: string;
  };
}
