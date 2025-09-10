// app/(admin)/admin/people/users/add/page.tsx
"use client";

import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import UserForm from "@/components/admin/user/Form";
import Link from "next/link";

export default function AddUserPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/admin/people/users");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link
          href="/admin/people/users"
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Add New User</h1>
      </div>

      <UserForm onSuccess={handleSuccess} />
    </div>
  );
}
