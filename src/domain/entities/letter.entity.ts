import {
  type LetterType,
  type LetterPriority,
  type Status,
  type LetterClassification,
} from "../enums";
import { type Approval } from "./approval.entity";
import type { User } from "./user.entity";
import type { Period } from "./period.entity";
import type { Event } from "./event.entity";
import type { Document } from "./document.entity";

export interface Letter {
  id: string;
  number?: string | null;
  regarding: string;
  origin: string;
  destination: string;
  classification?: LetterClassification | null;
  date: Date;
  type: LetterType;
  priority: LetterPriority;
  body?: string | null;
  letter?: string | null;
  notes?: string | null;
  status: Status;
  createdById: string;
  approvedById?: string | null;
  periodId?: string | null;
  eventId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: User;
  approvedBy?: User | null;
  period?: Period | null;
  event?: Event | null;
  attachments: Document[];
  approvals: Approval[];
}

export interface CreateLetterInput {
  number?: string;
  regarding: string;
  origin: string;
  destination: string;
  classification?: LetterClassification;
  date: string | Date;
  type: LetterType;
  priority: LetterPriority;
  body?: string;
  letter?: string;
  notes?: string;
  status?: Status;
  periodId?: string;
  eventId?: string;
}

export interface UpdateLetterInput {
  number?: string;
  regarding?: string;
  origin?: string;
  destination?: string;
  classification?: LetterClassification;
  date?: string | Date;
  type?: LetterType;
  priority?: LetterPriority;
  body?: string;
  letter?: string;
  notes?: string;
  status?: Status;

  approvedById?: string;
  periodId?: string;
  eventId?: string;
}

export interface LetterFilter {
  type?: LetterType;
  priority?: LetterPriority;
  classification?: LetterClassification;
  periodId?: string;
  eventId?: string;
  search?: string;
}
