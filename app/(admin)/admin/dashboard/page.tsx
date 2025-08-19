import { cookies } from "next/headers";
import { getGoogleDriveFiles } from "@/app/(admin)/admin/server";
import DriveManager from "@/app/(admin)/admin/dashboard/components/DriveManager";
import GoogleDriveConnect from "@/components/admin/google-drive/GoogleDriveConnect";
import StatsOverview from "@/app/(admin)/admin/dashboard/components/StatsOverview";
import RecentActivity from "@/app/(admin)/admin/dashboard/components/RecentActivity";
import QuickActions from "@/app/(admin)/admin/dashboard/components/QuickActions";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get("google_access_token")?.value || "";

  if (!accessToken) {
    return (
      <div className="h-[80dvh] bg-gray-50 flex">
        {/* Main Content */}
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
    { title: "Total Files", value: files.length, change: "+12%", trend: "up" },
    { title: "Active Users", value: 1243, change: "+5%", trend: "up" },
    { title: "Storage Used", value: "78%", change: "-3%", trend: "down" },
    { title: "Tasks Completed", value: 89, change: "+24%", trend: "up" },
  ];

  const recentActivities = [
    { id: 1, user: "John Doe", action: "uploaded a file", time: "2 mins ago" },
    {
      id: 2,
      user: "Jane Smith",
      action: "created a folder",
      time: "10 mins ago",
    },
    {
      id: 3,
      user: "Robert Johnson",
      action: "shared a document",
      time: "25 mins ago",
    },
    {
      id: 4,
      user: "Emily Davis",
      action: "updated settings",
      time: "1 hour ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="p-6 space-y-6">
        {/* Stats Overview */}
        <StatsOverview stats={statsData} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Drive Manager */}
          <div className="lg:col-span-2">
            <DriveManager files={files} accessToken={accessToken} />
          </div>

          {/* Sidebar with Recent Activity and Quick Actions */}
          <div className="space-y-6">
            <QuickActions />
            <RecentActivity activities={recentActivities} />
          </div>
        </div>
      </main>
    </div>
  );
}
