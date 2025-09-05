import { cookies } from "next/headers";
import { getGoogleDriveFiles } from "@/lib/server/google-drive";
import DriveTable from "@/components/admin/drive/Table";
import GoogleDriveConnect from "@/components/admin/google-drive/GoogleDriveConnect";
import StatsOverview from "@/components/admin/drive/Stats";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

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

  // Data dummy untuk komponen dashboard
  const statsData = [
    {
      title: "Total Files",
      value: files.length,
      change: "+12%",
      trend: "up" as const,
    },
    { title: "Active Users", value: 1243, change: "+5%", trend: "up" as const },
    {
      title: "Storage Used",
      value: "78%",
      change: "-3%",
      trend: "down" as const,
    },
    {
      title: "Tasks Completed",
      value: 89,
      change: "+24%",
      trend: "up" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-6 space-y-6">
        {/* Header dengan tombol tambah */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">
            Google Drive Manager
          </h1>
          <Link
            href="/admin/drive/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Tambah File
          </Link>
        </div>

        {/* Stats Overview */}
        <StatsOverview stats={statsData} />
          {/* Drive Table */}
          <div className="">
            <DriveTable files={files} accessToken={accessToken} />
          </div>
      </main>
    </div>
  );
}
