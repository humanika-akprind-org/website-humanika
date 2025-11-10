import LetterForm from "@/components/admin/letter/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type {
  CreateLetterInput,
  UpdateLetterInput,
  Letter,
} from "@/types/letter";
import { Status, ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/enums";

import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { getPeriods } from "@/use-cases/api/period";
import { getEvents } from "@/use-cases/api/event";

async function EditLetterPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    // Fetch letter data and related data
    const [letter, periodsResponse, eventsResponse] = await Promise.all([
      prisma.letter.findUnique({
        where: { id: params.id },
        include: {
          createdBy: true,
          approvedBy: true,
          period: true,
          event: true,
          attachments: true,
          approvals: true,
        },
      }),
      getPeriods(),
      getEvents(),
    ]);

    if (!letter) {
      notFound();
    }

    // Transform letter data to match Letter type
    const transformedLetter = letter as unknown as Letter;
    const periods = periodsResponse || [];
    const events = eventsResponse || [];

    const handleSubmit = async (
      data: CreateLetterInput | UpdateLetterInput
    ) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to UpdateLetterInput since this is the edit page
      const letterData = data as UpdateLetterInput;

      if (!letterData.regarding || !letterData.number || !letterData.date) {
        throw new Error("Missing required fields");
      }

      // Prepare data to send
      const submitData = {
        regarding: letterData.regarding,
        number: letterData.number,
        date: new Date(letterData.date),
        type: letterData.type,
        priority: letterData.priority,
        origin: letterData.origin,
        destination: letterData.destination,
        body: letterData.body,
        letter: letterData.letter === undefined ? null : letterData.letter,
        notes: letterData.notes,
        // status: letterData.status || Status.DRAFT, // Status is not in UpdateLetterInput
        approvedById: letterData.approvedById,
        periodId: letterData.periodId,
        eventId: letterData.eventId,
      };

      await prisma.letter.update({
        where: { id: params.id },
        data: submitData,
      });

      redirect("/admin/administration/letters");
    };

    const handleSubmitForApproval = async (
      data: CreateLetterInput | UpdateLetterInput
    ) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to UpdateLetterInput since this is the edit page
      const letterData = data as UpdateLetterInput;

      if (!letterData.regarding || !letterData.number || !letterData.date) {
        throw new Error("Missing required fields");
      }

      // Prepare data to send
      const submitData = {
        regarding: letterData.regarding,
        number: letterData.number,
        date: new Date(letterData.date),
        type: letterData.type,
        priority: letterData.priority,
        origin: letterData.origin,
        destination: letterData.destination,
        body: letterData.body,
        letter: letterData.letter === undefined ? null : letterData.letter,
        notes: letterData.notes,
        status: Status.PENDING,
        approvedById: letterData.approvedById,
        periodId: letterData.periodId,
        eventId: letterData.eventId,
      };

      await prisma.letter.update({
        where: { id: params.id },
        data: submitData,
      });

      // Check if approval already exists for this letter
      const existingApproval = await prisma.approval.findFirst({
        where: {
          entityType: ApprovalType.LETTER,
          entityId: params.id,
        },
      });

      if (!existingApproval) {
        // Create approval record for the letter if it doesn't exist
        await prisma.approval.create({
          data: {
            entityType: ApprovalType.LETTER,
            entityId: params.id,
            userId: user.id,
            status: StatusApproval.PENDING,
            note: "Letter submitted for approval",
          },
        });
      } else {
        // Update existing approval status to PENDING
        await prisma.approval.update({
          where: { id: existingApproval.id },
          data: {
            status: StatusApproval.PENDING,
          },
        });
      }

      redirect("/admin/administration/letters");
    };

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="p-6 max-w-4xl min-h-screen mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/admin/administration/letters"
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">Edit Letter</h1>
          </div>
          <LetterForm
            letter={transformedLetter}
            accessToken={accessToken}
            events={events}
            periods={periods}
            onSubmit={handleSubmit}
            onSubmitForApproval={handleSubmitForApproval}
            isEditing={true}
          />
        </div>
      </AuthGuard>
    );
  } catch (error) {
    console.error("Error loading form data:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="text-center text-red-500">
              <h2 className="text-xl font-semibold mb-4">Error Loading Form</h2>
              <p>{error instanceof Error ? error.message : "Unknown error"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EditLetterPage;
