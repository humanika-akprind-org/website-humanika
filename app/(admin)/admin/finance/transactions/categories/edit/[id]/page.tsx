"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FinanceCategoryForm from "@/components/admin/finance/category/Form";
import {
  getFinanceCategory,
  updateFinanceCategory,
} from "@/use-cases/api/finance-category";
import type {
  FinanceCategory,
  CreateFinanceCategoryInput,
  UpdateFinanceCategoryInput,
} from "@/types/finance-category";
import { useToast } from "@/hooks/use-toast";

export default function EditFinanceCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const [category, setCategory] = useState<FinanceCategory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const { toast } = useToast();

  const categoryId = params.id as string;

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setIsLoadingData(true);
        const data = await getFinanceCategory(categoryId);
        setCategory(data);
      } catch (error) {
        console.error("Error fetching finance category:", error);
        toast({
          title: "Error",
          description: "Failed to fetch finance category",
          variant: "destructive",
        });
        router.push("/admin/finance/transactions/categories");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId, router, toast]);

  const handleSubmit = async (
    data: CreateFinanceCategoryInput | UpdateFinanceCategoryInput
  ) => {
    try {
      setIsLoading(true);
      await updateFinanceCategory(
        categoryId,
        data as UpdateFinanceCategoryInput
      );
      toast({
        title: "Success",
        description: "Finance category updated successfully",
      });
      router.push("/admin/finance/transactions/categories");
    } catch (error) {
      console.error("Error updating finance category:", error);
      toast({
        title: "Error",
        description: "Failed to update finance category",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Finance Category
            </h1>
            <p className="text-gray-600">Loading category data...</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Edit Finance Category
            </h1>
            <p className="text-gray-600">Category not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Finance Category
          </h1>
          <p className="text-gray-600">Update finance category information</p>
        </div>
      </div>

      {/* Form */}
      <FinanceCategoryForm
        category={category}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
