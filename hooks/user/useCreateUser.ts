import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserApi } from "@/use-cases/api/user";
import type { CreateUserData } from "@/types/user";

export function useCreateUser() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createUser = async (formData: CreateUserData) => {
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

  return {
    createUser,
    isSubmitting,
    error,
    setError,
  };
}
