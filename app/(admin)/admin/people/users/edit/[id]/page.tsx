// app/(admin)/admin/people/users/edit/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import UserEditForm from "@/components/admin/user/EditForm";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import PageHeader from "@/components/admin/ui/PageHeader";
import { type User, UserApi } from "@/use-cases/api/user";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setAlert(null);
        const response = await UserApi.getUserById(userId);

        if (response.error) {
          setAlert({ type: "error", message: response.error });
        } else if (response.data) {
          setUser(response.data);
        }
      } catch (_error) {
        setAlert({ type: "error", message: "Failed to fetch user data" });
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
      <PageHeader title="Edit User" onBack={() => router.back()} />

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
