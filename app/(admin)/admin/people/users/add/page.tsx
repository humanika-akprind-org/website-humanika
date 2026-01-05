// app/(admin)/admin/people/users/add/page.tsx
"use client";

import UserForm from "@/components/admin/pages/user/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateUser } from "@/hooks/user/useCreateUser";

export default function AddUserPage() {
  const { createUser, handleBack, isSubmitting, error } = useCreateUser();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New User" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting ? <LoadingForm /> : <UserForm onSubmit={createUser} />}
    </div>
  );
}
