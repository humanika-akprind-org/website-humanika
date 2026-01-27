import { type Status } from "../enums/enums";
import { type User } from "./user.entity";
import { type Letter } from "./letter.entity";
import { type Approval } from "./approval.entity";
import { type DocumentType } from "../value-objects/document-type";
import { type Period } from "./period.entity";

export interface Document {
  type: string;
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
  letterId?: string;
}

export interface DocumentFilter {
  status?: Status;
  userId?: string;
  letterId?: string;
  documentTypeId?: string;
  search?: string;
  periodId?: string;
}
