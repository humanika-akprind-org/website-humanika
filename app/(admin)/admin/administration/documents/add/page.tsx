import { UserApi } from "@/use-cases/api/user";
// Fetch events/letters directly from the database (server-side) to avoid
// depending on the HTTP API from server components which may fail due to
// network/auth constraints.
import DocumentForm from "@/components/admin/document/Form";
import type { Event } from "@/types/event";
import type { Letter } from "@/types/letter";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { getGoogleAccessToken } from "@/lib/google-drive/google-oauth";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import { Status, ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/enums";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function AddDocumentPage() {
  const accessToken = await getGoogleAccessToken();

  try {
    // Fetch users first (this is used to assign ownership).
    const usersResponse = await UserApi.getUsers({ limit: 50 });
    const users = usersResponse.data?.users || [];

    // Fetch events and letters directly from the database; use allSettled
    // so that a failure in one doesn't block rendering the form.
    const [eventsSettled, lettersSettled] = await Promise.allSettled([
      prisma.event.findMany({ orderBy: { name: "asc" } }),
      prisma.letter.findMany({ orderBy: { date: "desc" } }),
    ]);

    const events =
      eventsSettled.status === "fulfilled" ? eventsSettled.value : [];
    if (eventsSettled.status === "rejected") {
      console.error("Failed to load events from DB:", eventsSettled.reason);
    }

    const letters =
      lettersSettled.status === "fulfilled" ? lettersSettled.value : [];
    if (lettersSettled.status === "rejected") {
      console.error("Failed to load letters from DB:", lettersSettled.reason);
    }

    const handleSubmit = async (
      data: CreateDocumentInput | UpdateDocumentInput
    ) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to CreateDocumentInput since this is the add page
      const documentData = data as CreateDocumentInput;

      if (!documentData.name || !documentData.documentTypeId) {
        throw new Error("Missing required fields");
      }

      // Prepare data to send
      const submitData = {
        name: documentData.name,
        documentTypeId: documentData.documentTypeId,
        status: Status.DRAFT,
        document: documentData.document,
        userId: user.id,
        eventId: documentData.eventId,
        letterId: documentData.letterId,
      };

      await prisma.document.create({
        data: submitData,
      });

      redirect("/admin/administration/documents");
    };

    const handleSubmitForApproval = async (
      data: CreateDocumentInput | UpdateDocumentInput
    ) => {
      "use server";

      const user = await getCurrentUser();
      if (!user) {
        throw new Error("Unauthorized");
      }

      // Cast data to CreateDocumentInput since this is the add page
      const documentData = data as CreateDocumentInput;

      if (!documentData.name || !documentData.documentTypeId) {
        throw new Error("Missing required fields");
      }

      // Prepare data to send
      const submitData = {
        name: documentData.name,
        documentTypeId: documentData.documentTypeId,
        status: Status.PENDING,
        document: documentData.document,
        userId: user.id,
        eventId: documentData.eventId,
        letterId: documentData.letterId,
      };

      // Create the document with PENDING status
      const document = await prisma.document.create({
        data: submitData,
      });

      // Create approval record for the document
      await prisma.approval.create({
        data: {
          entityType: ApprovalType.DOCUMENT,
          entityId: document.id,
          userId: user.id,
          status: StatusApproval.PENDING,
        },
      });

      redirect("/admin/administration/documents");
    };

    return (
      <AuthGuard accessToken={accessToken}>
        <div className="p-6 max-w-4xl min-h-screen mx-auto">
          <div className="flex items-center mb-6">
            <Link
              href="/admin/administration/documents"
              className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
            >
              <FiArrowLeft className="mr-1" />
              Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">
              Add New Document
            </h1>
          </div>
          <DocumentForm
            accessToken={accessToken}
            users={users}
            events={
              events.map((ev) => ({
                id: ev.id,
                name: ev.name,
              })) as unknown as Event[]
            }
            letters={
              letters.map((l) => ({
                id: l.id,
                number: l.number,
                regarding: l.regarding,
              })) as unknown as Letter[]
            }
            onSubmit={handleSubmit}
            onSubmitForApproval={handleSubmitForApproval}
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

export default AddDocumentPage;
