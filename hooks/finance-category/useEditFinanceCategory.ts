import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  FinanceCategory,
  UpdateFinanceCategoryInput,
} from "@/types/finance-category";
import {
  getFinanceCategory,
  updateFinanceCategory,
} from "@/use-cases/api/finance-category";
import { useToast } from "@/hooks/use-toast";

export function useEditFinanceCategory(id: string) {
  const router = useRouter();
  const [category, setCategory] = useState<FinanceCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const data = await getFinanceCategory(id);
        setCategory(data);
      } catch (err) {
        console.error("Error fetching finance category:", err);
        setError("Failed to fetch finance category");
        toast({
          title: "Error",
          description: "Failed to fetch finance category",
          variant: "destructive",
        });
        router.push("/admin/finance/transactions/categories");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id, router, toast]);

  const updateFinanceCategoryHandler = async (
    formData: UpdateFinanceCategoryInput
  ) => {
    try {
      await updateFinanceCategory(id, formData);
      toast({
        title: "Success",
        description: "Finance category updated successfully",
      });
      router.push("/admin/finance/transactions/categories");
    } catch (err) {
      console.error("Error updating finance category:", err);
      setError("Failed to update finance category. Please try again.");
      toast({
        title: "Error",
        description: "Failed to update finance category",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    category,
    loading,
    error,
    updateFinanceCategory: updateFinanceCategoryHandler,
    handleBack,
  };
}
