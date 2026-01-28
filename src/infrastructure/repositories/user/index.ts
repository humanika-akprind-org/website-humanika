/**
 * User Repository - Barrel Export
 * Part of Clean Architecture: Infrastructure Layer
 */

// Export types
export type { UserFilter } from "./get-users.repository";

// Export standalone repository functions
export * from "./get-users.repository";
export * from "./get-user-by-id.repository";
export * from "./create-user.repository";
export * from "./update-user.repository";
export * from "./delete-user.repository";
export * from "./delete-account.repository";
export * from "./change-password.repository";
export * from "./verify-user.repository";
export * from "./bulk-verify-users.repository";
export * from "./bulk-send-verification-emails.repository";

// Export Prisma Repository Implementation
export { UserRepositoryPrisma } from "./user-repository-prisma";
