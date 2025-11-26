// app/(admin)/admin/people/users/add/page.tsx
"use client";

import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useRouter } from "next/navigation";
import UserForm from "@/components/admin/user/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import Link from "next/link";
import { type CreateUserData } from "@/components/admin/user/Form";
import { UserApi } from "@/use-cases/api/user";

export default function AddUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData: CreateUserData) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await UserApi.createUser(formData);

      if (response.error) {
        setError(response.error);
      } else {
        router.push("/admin/people/users");
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {isSubmitting ? <LoadingForm /> : <UserForm onSubmit={handleSubmit} />}
    </div>
  );
}
