import { useState, useEffect } from "react";
import { ManagementApi } from "@/presentation/services/management";
import { PeriodApi } from "@/presentation/services/period";
import type { Management } from "@/domain/entities/management.entity";
import type { Period } from "@/domain/entities/period.entity";

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
