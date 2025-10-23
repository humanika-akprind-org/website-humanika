import { UserApi } from "@/use-cases/api/user";
import DocumentForm from "@/components/admin/document/Form";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
  Document,
} from "@/types/document";
import { Status } from "@/types/enums";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

async function AddDocumentPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    const usersResponse = await UserApi.getUsers({ limit: 50 });

    const users = usersResponse.data?.users || [];

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
            events={[]} // TODO: Add events API
            letters={[]} // TODO: Add letters API
            onSubmit={handleSubmit}
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
