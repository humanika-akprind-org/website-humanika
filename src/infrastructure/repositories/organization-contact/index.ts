/**
 * Organization Contact Repository Index - Barrel exports
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file re-exports all organization contact repository functions and types
 * for convenient imports throughout the application.
 */

// Export repository class
export { OrganizationContactRepositoryPrisma } from "./organization-contact-repository-prisma";

// Export functions
export * from "./get-organization-contacts.repository";
export * from "./get-organization-contact-by-id.repository";
export * from "./get-organization-contact-by-period.repository";
export * from "./get-active-period-organization-contact.repository";
export * from "./create-organization-contact.repository";
export * from "./update-organization-contact.repository";
export * from "./delete-organization-contact.repository";
