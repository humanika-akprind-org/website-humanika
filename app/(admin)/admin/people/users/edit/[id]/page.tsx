// app/(admin)/admin/people/users/edit/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import UserEditForm from "@/components/admin/user/EditForm";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import Alert from "@/components/admin/ui/alert/Alert";
import PageHeader from "@/components/admin/ui/PageHeader";
import { useEditUser } from "@/hooks/user/useEditUser";

export default function EditUserPage() {
  const params = useParams();
  const userId = params.id as string;

  const { user, loading, alert, handleSuccess, handleDelete, handleBack } =
    useEditUser(userId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit User" onBack={handleBack} />

      {alert && <Alert type={alert.type} message={alert.message} />}

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
