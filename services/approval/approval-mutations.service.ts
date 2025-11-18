import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { NextRequest } from "next/server";
import { StatusApproval } from "@prisma/client";
import type {
  CreateApprovalData,
  UpdateApprovalData,
  ApprovalWithRelations,
} from "@/types/approval";
import {
  findApprovalByEntity,
  createApprovalRecord,
  updateApprovalRecord,
  deleteApprovalRecord,
  findApprovalById,
} from "./approval-queries.service";
import { updateEntityStatus } from "../entityStatusUpdater";

export async function createApproval(
  data: CreateApprovalData,
  userId: string,
  request: NextRequest
): Promise<ApprovalWithRelations> {
  const { entityType, entityId, userId: approvalUserId, status, note } = data;

  // Check if approval already exists for this entity
  const existingApproval = await findApprovalByEntity(
    entityType,
    entityId,
    approvalUserId
  );

  if (existingApproval) {
    throw new Error("Approval already exists for this entity");
  }

  const approval = await createApprovalRecord({
    entityType,
    entityId,
    userId: approvalUserId,
    status: status || "PENDING",
    note,
  });

  // Log activity
  await logActivityFromRequest(request, {
    userId,
    activityType: ActivityType.CREATE,
    entityType: "Approval",
    entityId: approval.id,
    description: `Created approval for ${entityType} entity`,
    metadata: {
      newData: {
        entityType,
        entityId,
        userId: approvalUserId,
        status: approval.status,
        note,
      },
    },
  });

  return approval;
}

export async function updateApproval(
  id: string,
  data: UpdateApprovalData,
  userId: string,
  request: NextRequest
): Promise<ApprovalWithRelations> {
  const { status, note } = data;

  // Get the approval to check current status and entity type
  const existingApproval = await findApprovalById(id);

  if (!existingApproval) {
    throw new Error("Approval not found");
  }

  // Update the approval
  const updatedApproval = await updateApprovalRecord(id, {
    status: status as StatusApproval,
    note,
  });

  // Log activity
  await logActivityFromRequest(request, {
    userId,
    activityType: ActivityType.UPDATE,
    entityType: "Approval",
    entityId: updatedApproval.id,
    description: `Updated approval status to ${status} for ${existingApproval.entityType} entity`,
    metadata: {
      oldData: {
        status: existingApproval.status,
        note: existingApproval.note,
      },
      newData: {
        status: updatedApproval.status,
        note: updatedApproval.note,
      },
    },
  });

  // If approval is approved or rejected, update the related entity's status
  if (
    status === StatusApproval.APPROVED ||
    status === StatusApproval.REJECTED
  ) {
    await updateEntityStatus(existingApproval, status);
  }

  return updatedApproval;
}

export async function deleteApproval(
  id: string,
  userId: string,
  request: NextRequest
): Promise<void> {
  const approval = await findApprovalById(id);

  if (!approval) {
    throw new Error("Approval not found");
  }

  await deleteApprovalRecord(id);

  // Log activity
  await logActivityFromRequest(request, {
    userId,
    activityType: ActivityType.DELETE,
    entityType: "Approval",
    entityId: id,
    description: `Deleted approval for ${approval.entityType} entity`,
    metadata: {
      oldData: {
        entityType: approval.entityType,
        entityId: approval.entityId,
        userId: approval.userId,
        status: approval.status,
        note: approval.note,
      },
      newData: null,
    },
  });
}