import { LetterType, LetterPriority, Status } from "./enums";

export interface Letter {
  id: string;
  number?: string | null;
  regarding: string;
  origin: string;
  destination: string;
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
  date: string | Date;
  type: LetterType;
  priority: LetterPriority;
  body?: string;
  letter?: string;
  notes?: string;
  periodId?: string;
  eventId?: string;
}

export interface UpdateLetterInput {
  number?: string;
  regarding?: string;
  origin?: string;
  destination?: string;
  date?: string | Date;
  type?: LetterType;
  priority?: LetterPriority;
  body?: string;
  letter?: string;
  notes?: string;

  approvedById?: string;
  periodId?: string;
  eventId?: string;
}

export interface LetterFilter {
  type?: LetterType;
  priority?: LetterPriority;
  periodId?: string;
  eventId?: string;
  search?: string;
}

// Placeholder interfaces for relations
interface User {
  id: string;
  name: string;
  email: string;
}

interface Period {
  id: string;
  name: string;
}

interface Event {
  id: string;
  name: string;
}

interface Document {
  id: string;
  name: string;
}

interface Approval {
  id: string;
}
