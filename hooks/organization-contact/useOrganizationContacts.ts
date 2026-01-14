import { useState, useEffect, useCallback } from "react";
import {
  getOrganizationContacts,
  getActivePeriodOrganizationContact,
} from "@/use-cases/api/organization-contact";
import type {
  OrganizationContact,
  OrganizationContactFilter,
} from "@/types/organization-contact";

// Helper to normalize mission field from JsonValue to string | string[]
function normalizeMission(
  mission: string | string[] | null | undefined
): string | string[] {
  if (mission === null || mission === undefined) {
    return [];
  }
  return mission;
}

// Helper to transform API response to match OrganizationContact type
function transformOrganizationContact(data: any): OrganizationContact {
  return {
    ...data,
    mission: normalizeMission(data.mission),
  };
}

// Helper to transform array of API responses
function transformOrganizationContacts(data: any[]): OrganizationContact[] {
  return data.map(transformOrganizationContact);
}

export function useOrganizationContacts(filter?: OrganizationContactFilter) {
  const [organizationContacts, setOrganizationContacts] = useState<
    OrganizationContact[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationContacts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getOrganizationContacts(filter);
      setOrganizationContacts(transformOrganizationContacts(data));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch organization contacts"
      );
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchOrganizationContacts();
  }, [fetchOrganizationContacts]);

  const refetch = useCallback(() => {
    fetchOrganizationContacts();
  }, [fetchOrganizationContacts]);

  return {
    organizationContacts,
    isLoading,
    error,
    refetch,
  };
}

export function useActivePeriodOrganizationContact() {
  const [organizationContact, setOrganizationContact] =
    useState<OrganizationContact | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivePeriodOrganizationContact = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getActivePeriodOrganizationContact();
        if (data) {
          setOrganizationContact(transformOrganizationContact(data));
        } else {
          setOrganizationContact(null);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch active period organization contact"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivePeriodOrganizationContact();
  }, []);

  return { organizationContact, isLoading, error };
}
