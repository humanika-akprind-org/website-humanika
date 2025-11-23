"use client";

import React, { useState, useEffect } from "react";
import MemberCard from "@/components/public/members/MemberCard";
import { UserApi } from "@/use-cases/api/user";
import type { User } from "@/types/user";

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    UserApi.getUsers({ limit: 100, allUsers: true })
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else {
          setUsers(res.data?.users || []);
          setError(null);
        }
      })
      .catch(() => {
        setError("Failed to fetch users.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <main className="container mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
          Members
        </h1>
        <div className="mb-8 max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {loading && (
          <p className="text-center text-gray-600">Loading members...</p>
        )}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <MemberCard key={user.id} user={user} />
              ))
            ) : (
              <p className="text-center text-gray-600 col-span-full">
                No members found.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
