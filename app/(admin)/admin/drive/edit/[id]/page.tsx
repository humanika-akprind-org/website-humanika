import { cookies } from "next/headers";
import DriveForm from "@/components/admin/drive/Form";
import GoogleDriveConnect from "@/components/admin/google-drive/GoogleDriveConnect";
import { getGoogleDriveFile } from "@/lib/server/google-drive";

interface EditDriveFilePageProps {
  params: {
    id: string;
  };
}

export default async function EditDriveFilePage({ params }: EditDriveFilePageProps) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";
  const fileId = params.id;

  if (!accessToken) {
    return (
      <div className="h-[80dvh] bg-gray-50 flex">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mb-6">
              <svg
                className="w-20 h-20 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
              Please authenticate to access the organizational management system
            </h1>
            <p className="text-gray-600 mb-6">
              Connect your Google Drive account to continue
            </p>
            <div className="flex justify-center">
              <GoogleDriveConnect />
            </div>
          </div>
        </div>
      </div>
    );
  }

  let file;
  try {
    file = await getGoogleDriveFile(accessToken, fileId);
  } catch (error) {
    console.error("Failed to fetch Google Drive file:", error);
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Edit File: {file.name}</h1>
        <DriveForm 
          accessToken={accessToken} 
          file={file}
          // Tidak perlu meneruskan onSuccess, komponen Form akan menangani navigasi sendiri
        />
      </div>
    </div>
  );
}