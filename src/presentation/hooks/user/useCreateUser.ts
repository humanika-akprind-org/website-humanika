import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserApi } from "@/presentation/services/user";
import type { CreateUserData } from "@/domain/entities/user.entity";

export function useCreateUser() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createUser = async (formData: CreateUserData) => {
    setIsSubmitting(true);
    setError("");

    try {
      await UserApi.createUser(formData);
      router.push("/admin/people/users");
    } catch (err) {
      console.error("Submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createUser,
    isSubmitting,
    error,
    setError,
    handleBack,
  };
}
