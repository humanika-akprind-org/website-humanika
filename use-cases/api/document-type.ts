import type {
  DocumentType,
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
} from "@/types/document-type";

export async function getDocumentTypes(): Promise<DocumentType[]> {
  const response = await fetch("/api/document/type");

  if (!response.ok) {
    throw new Error("Failed to fetch document types");
  }

  return response.json();
}

export async function getDocumentType(id: string): Promise<DocumentType> {
  const response = await fetch(`/api/document/type/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Document type not found");
    }
    throw new Error("Failed to fetch document type");
  }

  return response.json();
}

export async function createDocumentType(
  data: CreateDocumentTypeInput
): Promise<DocumentType> {
  const response = await fetch("/api/document/type", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create document type");
  }

  return response.json();
}

export async function updateDocumentType(
  id: string,
  data: UpdateDocumentTypeInput
): Promise<DocumentType> {
  const response = await fetch(`/api/document/type/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update document type");
  }

  return response.json();
}

export async function deleteDocumentType(id: string): Promise<void> {
  const response = await fetch(`/api/document/type/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete document type");
  }
}
