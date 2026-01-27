export interface DocumentType {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDocumentTypeInput {
  name: string;
  description?: string;
}

export interface UpdateDocumentTypeInput
  extends Partial<CreateDocumentTypeInput> {}
