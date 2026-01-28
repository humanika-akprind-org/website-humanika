import { getGoogleDriveFiles } from "@/infrastructure/external-services/google/google-drive";
import DriveGrid from "@/presentation/components/admin/pages/drive/Grid";
import PageHeader from "@/presentation/components/admin/pages/drive/PageHeader";
import AuthGuard from "@/presentation/components/admin/auth/google-oauth/AuthGuard";
import { getGoogleAccessToken } from "@/infrastructure/external-services/google/google-oauth";

export default async function DashboardPage() {
  const accessToken = await getGoogleAccessToken();

  let files = [];
  if (accessToken) {
    try {
      // Fetch files from root folder (My Drive) first time
      files = await getGoogleDriveFiles(accessToken, "root");
    } catch (error) {
      console.error("Failed to fetch Google Drive files:", error);
    }
  }

  return (
    <AuthGuard accessToken={accessToken}>
      <PageHeader title="Google Drive Manager" />
      <div className="">
        <DriveGrid files={files} accessToken={accessToken} />
      </div>
    </AuthGuard>
  );
}
