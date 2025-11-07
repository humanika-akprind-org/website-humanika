import DriveForm from "@/components/admin/drive/Form";
import PageHeader from "@/components/admin/drive/PageHeader";
import { getGoogleDriveFile } from "@/lib/google-drive/google-drive";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";

async function EditDriveFilePage({ params }: { params: { id: string } }) {
  const fileId = params.id;

  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  let file = null;
  if (accessToken) {
    try {
      file = await getGoogleDriveFile(accessToken, fileId);
    } catch (error) {
      console.error("Failed to fetch Google Drive file:", error);
    }
  }

  if (accessToken && !file) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
            <h1 className="mb-4 text-red-500 text-xl font-medium">
              Failed to load file details
            </h1>
            <div className="flex gap-4">
              <a
                href="/admin/drive"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Kembali ke Drive
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard accessToken={accessToken}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <PageHeader title={`Edit File: ${file?.name || ""}`} />
          <DriveForm accessToken={accessToken} file={file} />
        </div>
      </div>
    </AuthGuard>
  );
}

export default EditDriveFilePage;
