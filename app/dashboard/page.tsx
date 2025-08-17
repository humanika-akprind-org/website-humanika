import { cookies } from "next/headers";
import { getGoogleDriveFiles } from "@/app/dashboard/server";
import DriveManager from "@/app/dashboard/components/DriveManager";
import GoogleDriveConnect from "@/components/google-drive/GoogleDriveConnect";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  if (!accessToken) {
    return (
      <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800">
          Please authenticate to access the organizational management system
        </h1>
        <GoogleDriveConnect />
      </div>
    );
  }

  let files;
  try {
    files = await getGoogleDriveFiles(accessToken);
  } catch (error) {
    console.error("Failed to fetch Google Drive files:", error);
    return (
      <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
        <h1 className="mb-4 text-red-500 text-xl font-medium">
          Failed to load organizational resources
        </h1>
        <div className="flex gap-4">
          <GoogleDriveConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
        <DriveManager files={files} accessToken={accessToken} />
      </div>
  );
}
