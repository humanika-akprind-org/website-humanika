import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import { Status, ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/enums";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import type { Prisma } from "@prisma/client";

export async function handleDocumentSubmit(
  data: CreateDocumentInput | UpdateDocumentInput,
  isEdit: boolean = false,
  documentId?: string,
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

  // Prepare data to send (use Prisma types directly)
  const submitData: Prisma.DocumentCreateInput | Prisma.DocumentUpdateInput = {
    name: documentData.name,
    documentType: { connect: { id: documentData.documentTypeId } },
    status: Status.DRAFT,
    document: documentData.document,
    user: { connect: { id: user.id } },
    letter: documentData.letterId
      ? { connect: { id: documentData.letterId } }
      : undefined,
  };

  if (isEdit && documentId) {
    await prisma.document.update({
      where: { id: documentId },
      data: submitData as Prisma.DocumentUpdateInput,
    });
  } else {
    await prisma.document.create({
      data: submitData as Prisma.DocumentCreateInput,
    });
  }

  redirect("/admin/administration/documents");
}

export async function handleDocumentSubmitForApproval(
  data: CreateDocumentInput | UpdateDocumentInput,
  isEdit: boolean = false,
  documentId?: string,
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

  // Prepare data to send (use Prisma types directly)
  const submitData: Prisma.DocumentCreateInput | Prisma.DocumentUpdateInput = {
    name: documentData.name,
    documentType: { connect: { id: documentData.documentTypeId } },
    status: Status.PENDING,
    document: documentData.document,
    user: { connect: { id: user.id } },
    letter: documentData.letterId
      ? { connect: { id: documentData.letterId } }
      : undefined,
  };

  let document;
  if (isEdit && documentId) {
    document = await prisma.document.update({
      where: { id: documentId },
      data: submitData as Prisma.DocumentUpdateInput,
    });
  } else {
    document = await prisma.document.create({
      data: submitData as Prisma.DocumentCreateInput,
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
