import { useState, useEffect } from "react";
import { getPeriods } from "@/lib/api/period";
import type { Period } from "@/types/period";

export function usePeriods() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        setLoading(true);
        const data = await getPeriods();
        setPeriods(data);
      } catch (_err) {
        setError("Failed to fetch periods");
      } finally {
        setLoading(false);
      }
    };

    fetchPeriods();
  }, []);

  return { periods, loading, error };
}
