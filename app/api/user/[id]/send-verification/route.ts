import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { appConfig } from "@/lib/config";
import { Resend } from "resend";

// Initialize Resend only if API key is available
let resend: Resend | null = null;
if (appConfig.resendApiKey) {
  resend = new Resend(appConfig.resendApiKey);
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify the user account
    await prisma.user.update({
      where: { id },
      data: {
        verifiedAccount: true,
      },
    });

    // Prepare email content to notify user that account is verified
    const subject = "Akun Anda Telah Diverifikasi";
    const html = `
      <p>Halo ${user.name},</p>
      <p>Akun email Anda telah berhasil diverifikasi.</p>
      <p>Anda sekarang dapat menggunakan semua fitur aplikasi.</p>
      <p>Terima kasih telah bergabung dengan kami.</p>
    `;

    // Send notification email using Resend directly (if available)
    if (!resend) {
      console.warn("Resend API key not configured. Skipping email send.");
      return NextResponse.json({
        message:
          "User account verified successfully (email not sent - API key not configured)",
      });
    }

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      throw new Error(`Failed to send notification email: ${error.message}`);
    }

    console.log("Email sent successfully:", data);

    return NextResponse.json({
      message: "Notification email sent successfully",
    });
  } catch (error) {
    console.error("Error sending notification email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
