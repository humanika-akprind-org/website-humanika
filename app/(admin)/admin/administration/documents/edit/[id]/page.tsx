import { UserApi } from "@/use-cases/api/user";
import DocumentForm from "@/components/admin/document/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import type { Event } from "@/types/event";
import type { Letter } from "@/types/letter";
import { cookies } from "next/headers";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
  Document,
} from "@/types/document";
import { Status, ApprovalType } from "@/types/enums";
import { StatusApproval } from "@/types/enums";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

async function EditDocumentPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    // Fetch document data
    const document = await prisma.document.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        event: true,
        letter: true,
      },
    });

    if (!document) {
      notFound();
    }

    // Transform document data to match Document type
    const transformedDocument = document as unknown as Document;

    // Fetch users first (this is used to assign ownership / show user list).
    const usersResponse = await UserApi.getUsers({ limit: 50 });
    const users = usersResponse.data?.users || [];

    // Fetch events and letters from DB (resiliently)
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

      // Cast data to UpdateDocumentInput since this is the edit page
      const documentData = data as UpdateDocumentInput;

      if (!documentData.name || !documentData.type) {
        throw new Error("Missing required fields");
      }

      // Prepare data to send
      const submitData: Omit<
        Document,
        | "id"
        | "user"
        | "event"
        | "letter"
        | "version"
        | "parentId"
        | "isCurrent"
        | "createdAt"
        | "updatedAt"
        | "previousVersion"
        | "nextVersions"
        | "approvals"
      > = {
        name: documentData.name,
        type: documentData.type,
        status: documentData.status || Status.DRAFT,
        document: documentData.document,
        userId: user.id,
        eventId: documentData.eventId,
        letterId: documentData.letterId,
      };

      await prisma.document.update({
        where: { id: params.id },
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

      // Cast data to UpdateDocumentInput since this is the edit page
      const documentData = data as UpdateDocumentInput;

      if (!documentData.name || !documentData.type) {
        throw new Error("Missing required fields");
      }

      // Prepare data to send
      const submitData: Omit<
        Document,
        | "id"
        | "user"
        | "event"
        | "letter"
        | "version"
        | "parentId"
        | "isCurrent"
        | "createdAt"
        | "updatedAt"
        | "previousVersion"
        | "nextVersions"
        | "approvals"
      > = {
        name: documentData.name,
        type: documentData.type,
        status: Status.PENDING,
        document: documentData.document,
        userId: user.id,
        eventId: documentData.eventId,
        letterId: documentData.letterId,
      };

      // Update the document with PENDING status
      await prisma.document.update({
        where: { id: params.id },
        data: submitData,
      });

      // Create approval record for the document
      await prisma.approval.create({
        data: {
          entityType: ApprovalType.DOCUMENT,
          entityId: params.id,
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
            <h1 className="text-2xl font-bold text-gray-800">Edit Document</h1>
          </div>
          <DocumentForm
            document={transformedDocument}
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

export default EditDocumentPage;
