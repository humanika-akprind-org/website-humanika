/**
 * Document Use Cases Index - Barrel exports
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This file re-exports all document use cases for convenient imports.
 */

// Read operations
export { GetDocumentsUseCase } from "./get-documents.usecase";
export { GetDocumentUseCase } from "./get-document.usecase";

// Write operations
export { CreateDocumentUseCase } from "./create-document.usecase";
export { UpdateDocumentUseCase } from "./update-document.usecase";
export { DeleteDocumentUseCase } from "./delete-document.usecase";
