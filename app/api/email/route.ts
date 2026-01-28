/**
 * Email API Route - Clean Architecture Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the clean architecture pattern:
 * - POST: Uses use case for write operations with validation
 *
 * Pattern Choice Rationale:
 * - POST (Write): Use case provides better separation for validation,
 *        error handling, and business logic
 */

import { type NextRequest, NextResponse } from "next/server";
import { SendEmailUseCase } from "@/application/use-cases/email";

// ============================================================================
// Validation Functions (for route-level early validation)
// ============================================================================

/**
 * Validate email input at route level
 * @param input - The input parameters to validate
 * @returns Validation result with isValid flag and error message
 */
function validateEmailInput(input: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): {
  isValid: boolean;
  error?: string;
} {
  const errors: string[] = [];

  if (!input.to || input.to.trim() === "") {
    errors.push("Recipient email (to) is required");
  }

  if (!input.subject || input.subject.trim() === "") {
    errors.push("Email subject is required");
  }

  if (!input.html || input.html.trim() === "") {
    errors.push("Email body (html) is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// POST /api/email - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Extract payload
    const body = await request.json();
    const { to, subject, html, from } = body;

    // 2. Basic validation at route level
    const validation = validateEmailInput({ to, subject, html, from });
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Use use case for business logic with comprehensive validation and error handling
    const useCase = new SendEmailUseCase({
      enableLogging: true,
    });
    const result = await useCase.execute({ to, subject, html, from });

    // 4. Return appropriate response based on result
    if (result.success) {
      return NextResponse.json(
        {
          message: "Email sent successfully",
          data: result.data,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        {
          error: result.error?.message || "Failed to send email",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error sending email:", error);

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Return a generic error for other cases
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
