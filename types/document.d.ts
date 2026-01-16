import { Status, DocumentType as DocumentTypeEnum } from "./enums";
import { User } from "./user";
import type { Event } from "./event";
import { Letter } from "./letter";
import { Approval } from "./approval";
import { DocumentType } from "./document-type";
import { Period } from "./period";

export interface Document {
  type: any;
  id: string;
  name: string;
  letterId?: string | null;
  documentTypeId: string;
  status: Status;
  document?: string | null;
  userId: string;
  user: User;
  periodId?: string | null;
  period?: Period;
  createdAt: Date;
  updatedAt: Date;
  letter?: Letter | null;
  documentType: DocumentType;
  nextVersions: Document[];
  approvals: Approval[];
}

export interface CreateDocumentInput {
  name: string;
  letterId?: string;
  documentTypeId: string;
  status?: Status;
  document?: string | null;
  periodId?: string;
}

export interface UpdateDocumentInput extends Partial<CreateDocumentInput> {
  status?: Status;
  letterId?: string | null;
}

export interface DocumentFilter {
  status?: Status;
  userId?: string;
  letterId?: string;
  documentTypeId?: string;
  search?: string;
  periodId?: string;
}
