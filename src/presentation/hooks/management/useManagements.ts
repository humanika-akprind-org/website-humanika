import { useState, useEffect } from "react";
import { ManagementApi } from "@/src/presentation/services/management";
import { PeriodApi } from "@/src/presentation/services/period";
import type { Management } from "@/src/domain/entities/management";
import type { Period } from "@/src/domain/entities/period";

export function useManagements() {
  const [managements, setManagements] = useState<Management[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [managementsResponse, periodsResponse] = await Promise.all([
          ManagementApi.getManagements(),
          PeriodApi.getPeriods(),
        ]);

        // Enhance managements with period data
        const enhancedManagements = managementsResponse.map((management) => ({
          ...management,
          period: periodsResponse.find(
            (period) => period.id === management.periodId,
          ),
        }));

        setManagements(enhancedManagements);
        setPeriods(periodsResponse);
      } catch (error) {
        console.error("Failed to fetch managements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { managements, periods, isLoading };
}
