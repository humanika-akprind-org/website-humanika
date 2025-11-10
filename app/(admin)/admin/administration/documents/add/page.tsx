import DocumentForm from "@/components/admin/document/Form";
import type { Event } from "@/types/event";
import type { Letter } from "@/types/letter";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { fetchDocumentFormData } from "@/hooks/document/useDocumentFormData";
import {
  handleDocumentSubmit,
  handleDocumentSubmitForApproval,
} from "@/lib/actions/documentActions";

async function AddDocumentPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  try {
    const { users, events, letters } = await fetchDocumentFormData();

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
            events={events as unknown as Event[]}
            letters={letters as unknown as Letter[]}
            onSubmit={handleDocumentSubmit}
            onSubmitForApproval={handleDocumentSubmitForApproval}
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
