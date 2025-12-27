"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LogoutButton } from "@/components/admin/auth/LogoutButton";
import Avatar from "../ui/avatar/Avatar";
import type { User } from "@/types/user";

export default function UserInfo() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="text-right min-w-[120px] max-w-[200px]">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-16" />
        </div>
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-2 text-gray-600">
        <div className="text-right min-w-[120px] max-w-[200px]">
          <p className="font-medium truncate">Not logged in</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsModalOpen(!isModalOpen)}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <div className="text-right min-w-[120px] max-w-[200px]">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-blue-200 text-xs bg-blue-600 px-2 py-1 rounded-full mt-1 inline-block">
            {user.role}
          </p>
        </div>
        <Link href="/admin/settings/profile">
          <Avatar user={user} size="md" />
        </Link>
      </button>

      {isModalOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 w-80">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Profile</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Username
              </label>
              <p className="text-sm text-gray-900">{user.username}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Email
              </label>
              <p className="text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Name
              </label>
              <p className="text-sm text-gray-900">{user.name}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Role
              </label>
              <p className="text-sm text-gray-900">{user.role}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Department
              </label>
              <p className="text-sm text-gray-900">{user.department}</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Position
              </label>
              <p className="text-sm text-gray-900">{user.position}</p>
            </div>
          </div>
          <LogoutButton />
        </div>
      )}
    </div>
  );
}
