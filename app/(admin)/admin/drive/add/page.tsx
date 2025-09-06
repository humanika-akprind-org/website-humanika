import DriveForm from "@/components/admin/drive/Form";
import PageHeader from "@/components/admin/drive/PageHeader";
import AuthGuard from "@/components/admin/auth/google-oauth/AuthGuard";
import { cookies } from "next/headers";

export default async function AddDriveFilePage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  return (
    <AuthGuard accessToken={accessToken}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <PageHeader title="Upload File Baru" />
          <DriveForm accessToken={accessToken} />
        </div>
      </div>
    </AuthGuard>
  );
}
