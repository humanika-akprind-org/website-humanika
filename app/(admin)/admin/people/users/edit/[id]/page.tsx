// app/(admin)/admin/people/users/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import UserEditForm from "@/components/admin/user/EditForm";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import { type User, UserApi } from "@/use-cases/api/user";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await UserApi.getUserById(userId);

        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setUser(response.data);
        }
      } catch (_error) {
        setError("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSuccess = () => {
    router.push("/admin/people/users");
  };

  const handleDelete = () => {
    router.push("/admin/people/users");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingForm />
      ) : user ? (
        <UserEditForm
          userId={userId}
          user={user}
          onSuccess={handleSuccess}
          onDelete={handleDelete}
        />
      ) : null}
    </div>
  );
}
