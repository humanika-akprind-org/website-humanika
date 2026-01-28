import DriveForm from "@/presentation/components/admin/pages/drive/Form";
import PageHeader from "@/presentation/components/admin/pages/drive/PageHeader";
import AuthGuard from "@/presentation/components/admin/auth/google-oauth/AuthGuard";
import { getGoogleAccessToken } from "@/infrastructure/external-services/google/google-oauth";

export default async function AddDriveFilePage() {
  const accessToken = await getGoogleAccessToken();

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
