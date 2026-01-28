import { Resend } from "resend";
import { appConfig } from "@/presentation/lib/config/config";

/**
 * Resend External Service
 * Part of Clean Architecture: Infrastructure Layer (External Services)
 *
 * This module handles the low-level communication with Resend API.
 * Encapsulates SDK initialization and email sending logic.
 */

// Initialize Resend client
const resend = new Resend(appConfig.resendApiKey);

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
  /** Sender email address (optional, defaults to Resend onboarding) */
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
 * Send an email using Resend API
 *
 * @param input - Email input parameters
 * @param options - Optional configuration
 * @returns Promise resolving to email result
 */
export async function sendEmail(
  input: EmailInput,
  options?: EmailOptions,
): Promise<EmailResult> {
  const from = input.from || options?.defaultFrom || "onboarding@resend.dev";
  const enableLogging = options?.enableLogging ?? true;

  try {
    if (enableLogging) {
      console.log(`[RESEND] Sending email to: ${input.to}`);
      console.log(`[RESEND] Subject: ${input.subject}`);
    }

    const { data, error } = await resend.emails.send({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      if (enableLogging) {
        console.error("[RESEND] API Error:", error);
      }

      return {
        success: false,
        error: {
          message: error.message,
        },
      };
    }

    if (enableLogging) {
      console.log(`[RESEND] Email sent successfully. ID: ${data?.id}`);
    }

    return {
      success: true,
      data: {
        id: data?.id || "",
        from,
        to: input.to,
        subject: input.subject,
      },
    };
  } catch (error) {
    if (enableLogging) {
      console.error("[RESEND] Unexpected error:", error);
    }

    return {
      success: false,
      error: {
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
    };
  }
}

/**
 * Send multiple emails in batch
 *
 * @param inputs - Array of email inputs
 * @param options - Optional configuration
 * @returns Promise resolving to array of email results
 */
export async function sendBatchEmail(
  inputs: EmailInput[],
  options?: EmailOptions,
): Promise<EmailResult[]> {
  const results = await Promise.all(
    inputs.map((input) => sendEmail(input, options)),
  );
  return results;
}
