// app/(admin)/admin/people/users/add/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import UserForm from "@/components/admin/user/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
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
      <PageHeader title="Add New User" backHref="/admin/people/users" />

      {error && <Alert type="error" message={error} />}

      {isSubmitting ? <LoadingForm /> : <UserForm onSubmit={handleSubmit} />}
    </div>
  );
}
