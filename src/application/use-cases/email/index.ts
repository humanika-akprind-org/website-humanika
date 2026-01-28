/**
 * Email Use Cases Index - Barrel exports
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This file re-exports all email use cases for convenient imports.
 */

// Write operations
export { SendEmailUseCase } from "./send-email.usecase";

// Types
export type {
  EmailInput,
  EmailResult,
  EmailOptions,
  EmailValidationResult,
} from "@/domain/entities/email.entity";
