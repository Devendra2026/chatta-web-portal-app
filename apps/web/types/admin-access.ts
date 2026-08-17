export const AdminPermission = {
  ContactsRead: "contact:read",
  ContactsUpdate: "contact:update",
  ContactsDelete: "contact:delete",
  GrievancesRead: "grievance:read",
  GrievancesUpdate: "grievance:update",
  GrievancesDelete: "grievance:delete",
  UsersRead: "user:read",
  UsersUpdate: "user:update",
  UsersDelete: "user:delete",
  RolesRead: "role:read",
  RolesCreate: "role:create",
  RolesUpdate: "role:update",
  RolesDelete: "role:delete",
  RolesPermissionsUpdate: "role:update_permissions",
  PermissionsRead: "role:read",
} as const;

export type AdminPermissionKey =
  (typeof AdminPermission)[keyof typeof AdminPermission];

export type AdminAccess = {
  id: number | null;
  clerkId: string;
  name: string;
  email: string;
  role: string | null;
  permissions: string[];
  hasExplicitPermissions: boolean;
  isAllowed: boolean;
};
