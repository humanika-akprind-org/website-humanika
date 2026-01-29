/**
 * Document Type Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all document type repository functions and types
 * for convenient imports throughout the application.
 */

// Export types
export type {
  DocumentType,
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
} from "@/domain/value-objects/document-type";

// Export functions
export * from "./get-document-types.repository";
export * from "./get-document-type.repository";
export * from "./create-document-type.repository";
export * from "./update-document-type.repository";
export * from "./delete-document-type.repository";

// Export Prisma repository implementation
export { DocumentTypeRepositoryPrisma } from "./document-type-repository-prisma";
