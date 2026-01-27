// app/(admin)/admin/people/users/add/page.tsx
"use client";

import UserForm from "@/presentation/components/admin/pages/user/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import { useCreateUser } from "@/presentation/hooks/user/useCreateUser";

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
