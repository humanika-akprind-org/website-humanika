import { useState, useEffect } from "react";
import { getFinanceCategories } from "@/src/presentation/use-cases/api/finance-category";
import { getWorkPrograms } from "@/src/presentation/use-cases/api/work";
import { getPeriods } from "@/src/presentation/use-cases/api/period";
import type { FinanceCategory } from "@/src/domain/value-objects/finance-category";
import type { WorkProgram } from "@/src/domain/entities/work";
import type { Period } from "@/src/domain/entities/period";

export function useFinanceFormData() {
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, workProgramsData, periodsData] =
          await Promise.all([
            getFinanceCategories(),
            getWorkPrograms(),
            getPeriods(),
          ]);
        setCategories(categoriesData);
        setWorkPrograms(workProgramsData);
        setPeriods(periodsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load form data",
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
    periods,
    loading,
    error,
  };
}
