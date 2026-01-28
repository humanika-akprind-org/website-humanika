/**
 * Email Entity - Domain Layer
 * Part of Clean Architecture: Domain Layer (Entities)
 *
 * This file defines types for email operations using Resend.
 */

/**
 * Input parameters for sending an email
 */
export interface EmailInput {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** Email body in HTML format */
  html: string;
  /** Sender email address (optional, defaults to onboarding@resend.dev) */
  from?: string;
}

/**
 * Result of sending an email
 */
export interface EmailResult {
  /** Whether the email was sent successfully */
  success: boolean;
  /** Response data from Resend API on success */
  data?: {
    /** Resend's internal ID for the email */
    id: string;
    /** Sender address used */
    from: string;
    /** Recipient address */
    to: string;
    /** Email subject */
    subject: string;
  };
  /** Error information on failure */
  error?: {
    /** Error message */
    message: string;
    /** Error code from Resend */
    code?: string;
  };
}

/**
 * Options for email sending configuration
 */
export interface EmailOptions {
  /** Default sender address */
  defaultFrom?: string;
  /** Whether to enable error logging */
  enableLogging?: boolean;
}

/**
 * Validation result for email input
 */
export interface EmailValidationResult {
  /** Whether the input is valid */
  isValid: boolean;
  /** Array of validation errors */
  errors: string[];
}
