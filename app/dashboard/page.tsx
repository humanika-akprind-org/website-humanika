import { cookies } from "next/headers";
import { getGoogleDriveFiles } from "@/app/dashboard/server";
import DriveManager from "@/app/dashboard/components/DriveManager";
import { LogoutButton } from "@/components/auth/LogoutButton";
import GoogleDriveConnect from "@/components/google-drive/GoogleDriveConnect";

export default async function Home() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  if (!accessToken) {
    return (
      <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
        <h1 className="mb-4">
          Please log in to access your Google Drive files.
          
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
        <h1 className="mb-4 text-red-500">Failed to load Google Drive files</h1>
        <div className="flex gap-4">
          <a
            href="/auth/login"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
            Re-login
          </a>
          <a
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                clipRule="evenodd"
              />
            </svg>
            Refresh
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-end mb-4">
        <LogoutButton />
      </div>
      <DriveManager files={files} accessToken={accessToken} />
    </div>
  );
}
