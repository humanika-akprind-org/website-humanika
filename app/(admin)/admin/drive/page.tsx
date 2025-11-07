import { getGoogleDriveFiles } from "@/lib/google-drive/google-drive";
import DriveTable from "@/components/admin/drive/Table";
import PageHeader from "@/components/admin/drive/PageHeader";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  let files = [];
  if (accessToken) {
    try {
      files = await getGoogleDriveFiles(accessToken);
    } catch (error) {
      console.error("Failed to fetch Google Drive files:", error);
    }
  }

  return (
    <AuthGuard accessToken={accessToken}>
      <div className="min-h-screen bg-gray-50">
        <main className="p-6 space-y-6">
          <PageHeader title="Google Drive Manager" showAddButton={true} />
          <div className="">
            <DriveTable files={files} accessToken={accessToken} />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
