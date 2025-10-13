"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FinanceCategoryForm from "@/components/admin/finance/category/Form";
import { createFinanceCategory } from "@/lib/api/finance-category";
import type {
  CreateFinanceCategoryInput,
  UpdateFinanceCategoryInput,
} from "@/types/finance-category";
import { useToast } from "@/hooks/use-toast";

export default function AddFinanceCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    data: CreateFinanceCategoryInput | UpdateFinanceCategoryInput
  ) => {
    try {
      setIsLoading(true);
      await createFinanceCategory(data as CreateFinanceCategoryInput);
      toast({
        title: "Success",
        description: "Finance category created successfully",
      });
      router.push("/admin/finance/transactions/categories");
    } catch (error) {
      console.error("Error creating finance category:", error);
      toast({
        title: "Error",
        description: "Failed to create finance category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Add New Finance Category
          </h1>
          <p className="text-gray-600">Create a new finance category</p>
        </div>
      </div>

      {/* Form */}
      <FinanceCategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
