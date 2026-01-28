/**
 * Send Email Use Case - Write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles sending emails with:
 * - Input validation
 * - Error handling with consistent response format
 * - Business logic encapsulation
 */

import type {
  EmailInput,
  EmailResult,
  EmailOptions,
  EmailValidationResult,
} from "@/domain/entities/email.entity";
import { sendEmail } from "@/infrastructure/external-services/resend/resend";

/**
 * Default sender address for emails
 */
const DEFAULT_FROM = "onboarding@resend.dev";

/**
 * Send Email Use Case
 *
 * Encapsulates the business logic for sending transactional emails.
 */
export class SendEmailUseCase {
  private readonly options: Required<EmailOptions>;

  /**
   * Create a new SendEmailUseCase instance
   * @param options - Configuration options for email sending
   */
  constructor(options?: Partial<EmailOptions>) {
    this.options = {
      defaultFrom: options?.defaultFrom || DEFAULT_FROM,
      enableLogging: options?.enableLogging ?? true,
    };
  }

  /**
   * Execute the use case to send an email
   *
   * @param input - Email input parameters
   * @returns Promise resolving to email result
   */
  async execute(input: EmailInput): Promise<EmailResult> {
    // 1. Validate input
    const validation = this.validateInput(input);
    if (!validation.isValid) {
      return {
        success: false,
        error: {
          message: `Validation failed: ${validation.errors.join(", ")}`,
        },
      };
    }

    // 2. Send email via external service
    const result = await sendEmail(input, {
      defaultFrom: this.options.defaultFrom,
      enableLogging: this.options.enableLogging,
    });

    return result;
  }

  /**
   * Execute with JSON body (for direct route handler use)
   *
   * @param body - Request body as JSON object
   * @returns Promise resolving to email result
   */
  async executeFromBody(body: Record<string, unknown>): Promise<EmailResult> {
    const input: EmailInput = {
      to: body.to as string,
      subject: body.subject as string,
      html: body.html as string,
      from: body.from as string | undefined,
    };

    return this.execute(input);
  }

  /**
   * Validate input parameters
   *
   * @param input - The input parameters to validate
   * @returns Validation result with isValid flag and error messages
   */
  validateInput(input: EmailInput): EmailValidationResult {
    const errors: string[] = [];

    // Validate 'to' field
    if (!input.to || input.to.trim() === "") {
      errors.push("Recipient email (to) is required");
    } else if (!this.isValidEmail(input.to)) {
      errors.push("Invalid recipient email format");
    }

    // Validate 'subject' field
    if (!input.subject || input.subject.trim() === "") {
      errors.push("Email subject is required");
    } else if (input.subject.length > 500) {
      errors.push("Email subject exceeds maximum length of 500 characters");
    }

    // Validate 'html' field
    if (!input.html || input.html.trim() === "") {
      errors.push("Email body (html) is required");
    } else if (input.html.length > 100000) {
      errors.push("Email body exceeds maximum length of 100,000 characters");
    }

    // Validate 'from' field if provided
    if (input.from && !this.isValidEmail(input.from)) {
      errors.push("Invalid sender email format");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate email format using regex
   *
   * @param email - Email address to validate
   * @returns True if valid email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Get the default sender address
   *
   * @returns Default sender address string
   */
  getDefaultFrom(): string {
    return this.options.defaultFrom;
  }

  /**
   * Get the logging enabled status
   *
   * @returns Whether logging is enabled
   */
  isLoggingEnabled(): boolean {
    return this.options.enableLogging;
  }
}
