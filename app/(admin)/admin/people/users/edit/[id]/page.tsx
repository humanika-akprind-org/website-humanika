// app/(admin)/admin/people/users/edit/[id]/page.tsx
"use client";

import { FiArrowLeft } from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import UserEditForm from "@/components/admin/user/EditForm";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

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

      <UserEditForm
        userId={userId}
        onSuccess={handleSuccess}
        onDelete={handleDelete}
      />
    </div>
  );
}
