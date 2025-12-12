import type {
  CreateDocumentInput,
  UpdateDocumentInput,
  Document,
} from "@/types/document";
import { Status, ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/enums";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export async function handleDocumentSubmit(
  data: CreateDocumentInput | UpdateDocumentInput,
  isEdit: boolean = false,
  documentId?: string
) {
  "use server";

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const documentData = data as CreateDocumentInput;

  if (!documentData.name || !documentData.documentTypeId) {
    throw new Error("Missing required fields");
  }

  // Prepare data to send
  const submitData = {
    name: documentData.name,
    documentTypeId: documentData.documentTypeId,
    status: Status.DRAFT,
    document: documentData.document,
    userId: user.id,
    eventId: documentData.eventId,
    letterId: documentData.letterId,
  };

  if (isEdit && documentId) {
    await prisma.document.update({
      where: { id: documentId },
      data: submitData,
    });
  } else {
    await prisma.document.create({
      data: submitData,
    });
  }

  redirect("/admin/administration/documents");
}

export async function handleDocumentSubmitForApproval(
  data: CreateDocumentInput | UpdateDocumentInput,
  isEdit: boolean = false,
  documentId?: string
) {
  "use server";

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const documentData = data as CreateDocumentInput;

  if (!documentData.name || !documentData.documentTypeId) {
    throw new Error("Missing required fields");
  }

  // Prepare data to send
  const submitData: Omit<
    Document,
    | "id"
    | "user"
    | "event"
    | "letter"
    | "version"
    | "parentId"
    | "isCurrent"
    | "createdAt"
    | "updatedAt"
    | "previousVersion"
    | "nextVersions"
    | "approvals"
    | "type"
    | "documentType"
  > = {
    name: documentData.name,
    documentTypeId: documentData.documentTypeId,
    status: Status.PENDING,
    document: documentData.document,
    userId: user.id,
    eventId: documentData.eventId,
    letterId: documentData.letterId,
  };

  let document;
  if (isEdit && documentId) {
    document = await prisma.document.update({
      where: { id: documentId },
      data: submitData,
    });
  } else {
    document = await prisma.document.create({
      data: submitData,
    });
  }

  // Create approval record for the document
  await prisma.approval.create({
    data: {
      entityType: ApprovalType.DOCUMENT,
      entityId: document.id,
      userId: user.id,
      status: StatusApproval.PENDING,
    },
  });

  redirect("/admin/administration/documents");
}
