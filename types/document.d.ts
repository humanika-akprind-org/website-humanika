import { DocumentType, Status } from "./enums";
import { User } from "./user";
import { Event } from "./event";
import { Letter } from "./letter";

export interface Document {
  id: string;
  name: string;
  eventId?: string | null;
  letterId?: string | null;
  type: DocumentType;
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
  previousVersion?: Document | null;
  nextVersions: Document[];
  approvals: Approval[];
}

export interface CreateDocumentInput {
  name: string;
  eventId?: string;
  letterId?: string;
  type: DocumentType;
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

// Assuming Approval is defined elsewhere, but for now, placeholder
interface Approval {
  id: string;
  // other fields
}
