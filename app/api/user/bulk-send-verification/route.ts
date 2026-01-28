/**
 * Bulk Send Verification Emails API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route handles sending verification emails to multiple users
 */

import { type NextRequest, NextResponse } from "next/server";
import { bulkSendVerificationEmails } from "@/infrastructure/repositories/user";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import prisma from "@/presentation/lib/prisma";
import { appConfig } from "@/presentation/lib/config/config";
import { Resend } from "resend";

// Initialize Resend only if API key is available
let resend: Resend | null = null;
if (appConfig.resendApiKey) {
  resend = new Resend(appConfig.resendApiKey);
}

// ============================================================================
// Local Types
// ============================================================================

interface BulkSendVerificationBody {
  userIds: string[];
  batchSize?: number;
}

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractBulkSendVerificationBody(
  request: NextRequest,
): Promise<BulkSendVerificationBody> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateBulkSendVerificationInput(body: BulkSendVerificationBody) {
  const errors: string[] = [];

  if (
    !body.userIds ||
    !Array.isArray(body.userIds) ||
    body.userIds.length === 0
  ) {
    errors.push("userIds array is required");
  }

  if (body.batchSize !== undefined && body.batchSize < 1) {
    errors.push("batchSize must be at least 1");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// Helper Functions
// ============================================================================

// Helper function to send emails in batches to avoid rate limits
async function sendEmailsInBatches(
  users: Array<{ id: string; email: string; name: string }>,
  batchSize: number = 10,
) {
  const results = [];
  const batches = [];

  // Create batches
  for (let i = 0; i < users.length; i += batchSize) {
    batches.push(users.slice(i, i + batchSize));
  }

  // Process each batch with delay
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(
      `Processing batch ${i + 1}/${batches.length} with ${batch.length} emails`,
    );

    const batchPromises = batch.map(async (user) => {
      try {
        // Prepare personalized email content
        const subject = "Akun Anda Telah Diverifikasi";
        const html = `
          <p>Halo ${user.name},</p>
          <p>Akun email Anda telah berhasil diverifikasi.</p>
          <p>Anda sekarang dapat menggunakan semua fitur aplikasi.</p>
          <p>Terima kasih telah bergabung dengan kami.</p>
        `;

        if (!resend) {
          throw new Error("Resend not configured");
        }

        const { data, error } = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: user.email,
          subject,
          html,
        });

        if (error) {
          console.error(`Failed to send email to ${user.email}:`, error);
          return {
            userId: user.id,
            email: user.email,
            success: false,
            error: error.message,
          };
        }

        console.log(`Email sent successfully to ${user.email}:`, data);
        return { userId: user.id, email: user.email, success: true };
      } catch (error: unknown) {
        console.error(`Error sending email to ${user.email}:`, error);
        return {
          userId: user.id,
          email: user.email,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    });

    // Wait for current batch to complete
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches (except for the last batch)
    if (i < batches.length - 1) {
      console.log(`Waiting 2 seconds before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  return results;
}

// ============================================================================
// POST /api/user/bulk-send-verification - Bulk send verification emails
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 2. Extract payload
    const body = await extractBulkSendVerificationBody(request);

    // 3. Basic validation
    const validation = validateBulkSendVerificationInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 4. Use repository for validation
    await bulkSendVerificationEmails(body.userIds);

    // 5. Get users for email sending
    const users = await prisma.user.findMany({
      where: {
        id: { in: body.userIds },
      },
      select: { id: true, email: true, name: true },
    });

    // 6. Check if Resend is configured
    if (!resend) {
      console.warn("Resend API key not configured. Skipping bulk email send.");
      return NextResponse.json({
        success: true,
        count: users.length,
        message: `Users found but emails not sent - API key not configured`,
        data: users.map((u) => ({ id: u.id, email: u.email })),
      });
    }

    console.log(
      `Starting bulk email send to ${users.length} users in batches of ${body.batchSize || 10}`,
    );

    // 7. Send emails in batches to handle rate limits and organizational domain restrictions
    const results = await sendEmailsInBatches(users, body.batchSize || 10);

    // 8. Count successful sends
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(
      `Bulk email send completed: ${successful} successful, ${failed} failed`,
    );

    // 9. Response
    return NextResponse.json({
      success: true,
      count: users.length,
      successful,
      failed,
      batchSize: body.batchSize || 10,
      message: `Emails sent: ${successful} successful, ${failed} failed`,
      data: results,
    });
  } catch (error) {
    console.error("Error bulk sending verification emails:", error);

    if ((error as Error).message.includes("userIds array is required")) {
      return NextResponse.json(
        { success: false, error: "userIds array is required" },
        { status: 400 },
      );
    }

    if ((error as Error).message.includes("Some users not found")) {
      return NextResponse.json(
        { success: false, error: "Some users not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
