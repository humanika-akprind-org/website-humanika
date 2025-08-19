import Link from "next/link";
import { Home, Users, FileText, Calendar, Settings } from "lucide-react";
import { LogoutButton } from "@/components/admin/auth/LogoutButton";

export default function Sidebar({ accessToken }: { accessToken: string }) {
  return (
    <div className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-gray-200 bg-white h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Organization Manager
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          href="/admin/dashboard"
          className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50 text-blue-600 font-medium"
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/admin/dashboard/members"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Users className="h-5 w-5" />
          <span>Members</span>
        </Link>

        <Link
          href="/admin/dashboard/documents"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <FileText className="h-5 w-5" />
          <span>Documents</span>
        </Link>

        <Link
          href="/admin/dashboard/calendar"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Calendar className="h-5 w-5" />
          <span>Calendar</span>
        </Link>

        <Link
          href="/admin/dashboard/settings"
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-200 space-y-4">
        {accessToken && (
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-gray-800">Admin User</p>
              <p className="text-sm text-gray-500">Organization Admin</p>
            </div>
          </div>
        )}

        <LogoutButton />
      </div>
    </div>
  );
}
