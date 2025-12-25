import { useState, useEffect } from "react";
import { getFinanceCategories } from "@/use-cases/api/finance-category";
import { getWorkPrograms } from "@/use-cases/api/work";
import type { FinanceCategory } from "@/types/finance-category";
import type { WorkProgram } from "@/types/work";

export function useFinanceFormData() {
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, workProgramsData] = await Promise.all([
          getFinanceCategories(),
          getWorkPrograms(),
        ]);
        setCategories(categoriesData);
        setWorkPrograms(workProgramsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load form data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    categories,
    workPrograms,
    loading,
    error,
  };
}
