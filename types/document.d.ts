import { Status, DocumentType as DocumentTypeEnum } from "./enums";
import { User } from "./user";
import { Event } from "./event";
import { Letter } from "./letter";
import { Approval } from "./approval";
import { DocumentType } from "./document-type";

export interface Document {
  id: string;
  name: string;
  eventId?: string | null;
  letterId?: string | null;
  documentTypeId: string;
  type: DocumentTypeEnum;
  status: Status;
  document?: string | null;
  userId: string;
  user: User;
  version: number;
  parentId?: string | null;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
  event?: Event | null;
  letter?: Letter | null;
  documentType?: DocumentType | null;
  previousVersion?: Document | null;
  nextVersions: Document[];
  approvals: Approval[];
}

export interface CreateDocumentInput {
  name: string;
  eventId?: string;
  letterId?: string;
  documentTypeId: string;
  status?: Status;
  document?: string | null;
}

export interface UpdateDocumentInput extends Partial<CreateDocumentInput> {
  status?: Status;
}

export interface DocumentFilter {
  type?: DocumentType;
  status?: Status;
  userId?: string;
  eventId?: string;
  letterId?: string;
  search?: string;
}
