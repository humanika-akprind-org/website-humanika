/**
 * Organization Contact Use Cases Index - Barrel exports
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This file re-exports all organization contact use cases for convenient imports.
 */

// Read operations
export { GetOrganizationContactsUseCase } from "./get-organization-contacts.usecase";
export { GetOrganizationContactByIdUseCase } from "./get-organization-contact-by-id.usecase";

// Write operations
export { CreateOrganizationContactUseCase } from "./create-organization-contact.usecase";
export { UpdateOrganizationContactUseCase } from "./update-organization-contact.usecase";
export { DeleteOrganizationContactUseCase } from "./delete-organization-contact.usecase";
