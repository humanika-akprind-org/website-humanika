import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { appConfig } from "@/lib/config";
import { Resend } from "resend";

// Initialize Resend only if API key is available
let resend: Resend | null = null;
if (appConfig.resendApiKey) {
  resend = new Resend(appConfig.resendApiKey);
}

// Helper function to send emails in batches to avoid rate limits
async function sendEmailsInBatches(users: Array<{ id: string; email: string; name: string }>, batchSize: number = 10) {
  const results = [];
  const batches = [];

  // Create batches
  for (let i = 0; i < users.length; i += batchSize) {
    batches.push(users.slice(i, i + batchSize));
  }

  // Process each batch with delay
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`Processing batch ${i + 1}/${batches.length} with ${batch.length} emails`);

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
          return { userId: user.id, email: user.email, success: false, error: error.message };
        }

        console.log(`Email sent successfully to ${user.email}:`, data);
        return { userId: user.id, email: user.email, success: true };
      } catch (error: unknown) {
        console.error(`Error sending email to ${user.email}:`, error);
        return {
          userId: user.id,
          email: user.email,
          success: false,
          error: (error instanceof Error) ? error.message : String(error)
        };
      }
    });

    // Wait for current batch to complete
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Add delay between batches (except for the last batch)
    if (i < batches.length - 1) {
      console.log(`Waiting 2 seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return results;
}

// POST - Bulk send verification emails
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIds, batchSize = 10 } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    // Check if all users exist
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds },
      },
      select: { id: true, email: true, name: true },
    });

    if (users.length !== userIds.length) {
      return NextResponse.json(
        { error: "Some users not found" },
        { status: 404 }
      );
    }

    // Check if Resend is configured
    if (!resend) {
      console.warn("Resend API key not configured. Skipping bulk email send.");
      return NextResponse.json({
        count: users.length,
        message: `Users found but emails not sent - API key not configured`,
        users: users.map(u => ({ id: u.id, email: u.email }))
      });
    }

    console.log(`Starting bulk email send to ${users.length} users in batches of ${batchSize}`);

    // Send emails in batches to handle rate limits and organizational domain restrictions
    const results = await sendEmailsInBatches(users, batchSize);

    // Count successful sends
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Bulk email send completed: ${successful} successful, ${failed} failed`);

    return NextResponse.json({
      count: users.length,
      successful,
      failed,
      batchSize,
      message: `Emails sent: ${successful} successful, ${failed} failed`,
      results
    });
  } catch (error) {
    console.error("Error bulk sending verification emails:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
