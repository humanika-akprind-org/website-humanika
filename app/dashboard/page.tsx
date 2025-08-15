import { cookies } from "next/headers";
import { getGoogleDriveFiles } from "@/app/dashboard/server";
import DriveManager from "@/app/dashboard/drive-manager";

export default async function Page() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  if (!accessToken) {
    return (
      <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
        <h1>Please log in to access your Google Drive files.</h1>
      </div>
    );
  }

  let files;
  try {
    files = await getGoogleDriveFiles(accessToken);
  } catch (error) {
    console.error(error);
    return (
      <div className="justify-center w-full flex text-center pt-10 flex-col items-center">
        <h1>Something went wrong! Please login again!</h1>
        <a
          href="/"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
              clipRule="evenodd"
            />
            <path
              fillRule="evenodd"
              d="M10 9a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Login Ulang
        </a>
      </div>
    );
  }

  return <DriveManager files={files} accessToken={accessToken} />;
}
