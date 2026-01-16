"use client";

import { useState, useEffect, useCallback } from "react";
import { hasPermission, type ActionType } from "@/lib/permissions";

interface UsePermissionReturn {
  userRole: string | null;
  loading: boolean;
  can: (resource: string, action: ActionType) => boolean;
  canView: (resource: string) => boolean;
  canAdd: (resource: string) => boolean;
  canEdit: (resource: string) => boolean;
  canDelete: (resource: string) => boolean;
  canApproval: (resource: string) => boolean;
  isBPH: boolean;
  isDPO: boolean;
  isPENGURUS: boolean;
}

export function usePermission(): UsePermissionReturn {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const user = await response.json();
          setUserRole(user.role);
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const can = useCallback(
    (resource: string, action: ActionType) =>
      hasPermission(resource, action, userRole),
    [userRole]
  );

  const canView = useCallback(
    (resource: string) => hasPermission(resource, "view", userRole),
    [userRole]
  );

  const canAdd = useCallback(
    (resource: string) => hasPermission(resource, "add", userRole),
    [userRole]
  );

  const canEdit = useCallback(
    (resource: string) => hasPermission(resource, "edit", userRole),
    [userRole]
  );

  const canDelete = useCallback(
    (resource: string) => hasPermission(resource, "delete", userRole),
    [userRole]
  );

  const canApproval = useCallback(
    (resource: string) => hasPermission(resource, "approval", userRole),
    [userRole]
  );

  const isBPH = userRole === "BPH";
  const isDPO = userRole === "DPO";
  const isPENGURUS = userRole === "PENGURUS";

  return {
    userRole,
    loading,
    can,
    canView,
    canAdd,
    canEdit,
    canDelete,
    canApproval,
    isBPH,
    isDPO,
    isPENGURUS,
  };
}

// Hook for using permission within a component with a specific resource
export function useResourcePermission(resource: string) {
  const permission = usePermission();

  return {
    ...permission,
    canView: () => permission.canView(resource),
    canAdd: () => permission.canAdd(resource),
    canEdit: () => permission.canEdit(resource),
    canDelete: () => permission.canDelete(resource),
    canApproval: () => permission.canApproval(resource),
  };
}
