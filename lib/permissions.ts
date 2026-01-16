// Permission types
export type ActionType = "view" | "add" | "edit" | "delete" | "approval";

export type UserRoleType = "DPO" | "BPH" | "PENGURUS" | "ANGGOTA";

export interface Permission {
  resource: string;
  action: ActionType;
  allowedRoles: UserRoleType[];
}

// Resource permissions based on middleware RBAC rules
export const permissions: Permission[] = [
  // Dashboard
  {
    resource: "dashboard",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },

  // Governance - Periods
  {
    resource: "periods",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "periods",
    action: "add",
    allowedRoles: ["DPO", "BPH"],
  },
  {
    resource: "periods",
    action: "edit",
    allowedRoles: ["DPO", "BPH"],
  },
  {
    resource: "periods",
    action: "delete",
    allowedRoles: ["DPO", "BPH"],
  },

  // Governance - Structure
  {
    resource: "structure",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "structure",
    action: "add",
    allowedRoles: ["BPH"],
  },
  {
    resource: "structure",
    action: "edit",
    allowedRoles: ["BPH"],
  },
  {
    resource: "structure",
    action: "delete",
    allowedRoles: ["BPH"],
  },

  // Governance - Managements
  {
    resource: "managements",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "managements",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "managements",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "managements",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // Governance - Tasks
  {
    resource: "tasks",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "tasks",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "tasks",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "tasks",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // People - Users
  {
    resource: "users",
    action: "view",
    allowedRoles: ["BPH"],
  },
  {
    resource: "users",
    action: "add",
    allowedRoles: ["BPH"],
  },
  {
    resource: "users",
    action: "edit",
    allowedRoles: ["BPH"],
  },
  {
    resource: "users",
    action: "delete",
    allowedRoles: ["BPH"],
  },

  // People - User Roles
  {
    resource: "user-roles",
    action: "view",
    allowedRoles: ["BPH"],
  },
  {
    resource: "user-roles",
    action: "edit",
    allowedRoles: ["BPH"],
  },

  // Content - Articles
  {
    resource: "articles",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "articles",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "articles",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "articles",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // Content - Article Categories
  {
    resource: "article-categories",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "article-categories",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "article-categories",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "article-categories",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // Content - Galleries
  {
    resource: "galleries",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "galleries",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "galleries",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "galleries",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // Content - Gallery Categories
  {
    resource: "gallery-categories",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "gallery-categories",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "gallery-categories",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "gallery-categories",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // Content - Organization Contacts
  {
    resource: "organization-contacts",
    action: "view",
    allowedRoles: ["BPH"],
  },
  {
    resource: "organization-contacts",
    action: "add",
    allowedRoles: ["BPH"],
  },
  {
    resource: "organization-contacts",
    action: "edit",
    allowedRoles: ["BPH"],
  },
  {
    resource: "organization-contacts",
    action: "delete",
    allowedRoles: ["BPH"],
  },

  // Content - Statistics
  {
    resource: "statistics",
    action: "view",
    allowedRoles: ["BPH"],
  },
  {
    resource: "statistics",
    action: "add",
    allowedRoles: ["BPH"],
  },
  {
    resource: "statistics",
    action: "edit",
    allowedRoles: ["BPH"],
  },
  {
    resource: "statistics",
    action: "delete",
    allowedRoles: ["BPH"],
  },

  // Program - Work Programs
  {
    resource: "works",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "works",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "works",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "works",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "works",
    action: "approval",
    allowedRoles: ["DPO", "BPH"],
  },

  // Program - Events
  {
    resource: "events",
    action: "view",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "events",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "events",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "events",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "events",
    action: "approval",
    allowedRoles: ["DPO", "BPH"],
  },

  // Program - Event Categories
  {
    resource: "event-categories",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "event-categories",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "event-categories",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "event-categories",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // Administration - Proposals
  {
    resource: "proposals",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "proposals",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "proposals",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "proposals",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "proposals",
    action: "approval",
    allowedRoles: ["DPO", "BPH"],
  },

  // Administration - Accountability Reports
  {
    resource: "accountability-reports",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "accountability-reports",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "accountability-reports",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "accountability-reports",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "accountability-reports",
    action: "approval",
    allowedRoles: ["DPO", "BPH"],
  },

  // Administration - Letters
  {
    resource: "letters",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "letters",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "letters",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "letters",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "letters",
    action: "approval",
    allowedRoles: ["DPO", "BPH"],
  },

  // Administration - Documents
  {
    resource: "documents",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "documents",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "documents",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "documents",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // Administration - Document Types
  {
    resource: "document-types",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "document-types",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "document-types",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "document-types",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // Finance - Transactions
  {
    resource: "transactions",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "transactions",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "transactions",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "transactions",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "transactions",
    action: "approval",
    allowedRoles: ["DPO", "BPH"],
  },

  // Finance - Transaction Categories
  {
    resource: "transaction-categories",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "transaction-categories",
    action: "add",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "transaction-categories",
    action: "edit",
    allowedRoles: ["BPH", "PENGURUS"],
  },
  {
    resource: "transaction-categories",
    action: "delete",
    allowedRoles: ["BPH", "PENGURUS"],
  },

  // System
  {
    resource: "system",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },

  // Settings
  {
    resource: "settings",
    action: "view",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },
  {
    resource: "settings",
    action: "edit",
    allowedRoles: ["DPO", "BPH", "PENGURUS"],
  },

  // Approval (generic)
  {
    resource: "approval",
    action: "view",
    allowedRoles: ["DPO", "BPH"],
  },
];

// Helper function to check permission
export function hasPermission(
  resource: string,
  action: ActionType,
  userRole: string | null
): boolean {
  if (!userRole) return false;

  const permission = permissions.find(
    (p) => p.resource === resource && p.action === action
  );

  if (!permission) return false;

  return permission.allowedRoles.includes(userRole as UserRoleType);
}

// Get all allowed actions for a resource
export function getAllowedActions(
  resource: string,
  userRole: string | null
): ActionType[] {
  if (!userRole) return [];

  return permissions
    .filter((p) => p.resource === resource)
    .filter((p) => p.allowedRoles.includes(userRole as UserRoleType))
    .map((p) => p.action);
}
