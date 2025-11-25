"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import GalleryCategoryForm from "@/components/admin/gallery/category/Form";
import type {
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/types/gallery-category";
import { useToast } from "@/hooks/use-toast";

export default function AddGalleryCategoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (
    data: CreateGalleryCategoryInput | UpdateGalleryCategoryInput
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/gallery/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create gallery category");
      }

      toast({
        title: "Success",
        description: "Gallery category created successfully",
      });

      router.push("/admin/content/galleries/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create gallery category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center mb-6">
        <Link
          href="/admin/content/galleries/categories"
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Add New Gallery Category
        </h1>
      </div>

      {/* Form */}
      <GalleryCategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
