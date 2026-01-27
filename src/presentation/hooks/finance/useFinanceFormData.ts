import { useState, useEffect } from "react";
import { getFinanceCategories } from "@/presentation/services/finance-category";
import { getWorkPrograms } from "@/presentation/services/work";
import { getPeriods } from "@/presentation/services/period";
import type { FinanceCategory } from "@/domain/value-objects/finance-category";
import type { WorkProgram } from "@/domain/entities/work-program.entity";
import type { Period } from "@/domain/entities/period.entity";

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
