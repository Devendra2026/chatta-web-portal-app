"use client";

import { useMemo } from "react";

import { useAdminAccess } from "@/hooks/use-admin-access";
import { useContacts } from "@/hooks/use-contacts";
import { useGrievances } from "@/hooks/use-grievances";
import {
  usePermissions,
  useRoles,
} from "@/hooks/use-rbac";
import { useSignupUsers } from "@/hooks/use-signup-users";
import { AdminPermission } from "@/types/admin-access";

export function useAdminModuleAccess() {
  const accessQuery = useAdminAccess();
  const {
    hasPermission,
    hasEveryPermission,
    isPermissionUnknown,
  } = accessQuery;

  const canReadContactsByPermission =
    hasPermission(AdminPermission.ContactsRead);
  const canReadGrievancesByPermission =
    hasPermission(AdminPermission.GrievancesRead);
  const canReadUsersByPermission =
    hasPermission(AdminPermission.UsersRead);
  const canReadRolesByPermission =
    hasPermission(AdminPermission.RolesRead);
  const canReadPermissionsByPermission =
    hasPermission(AdminPermission.PermissionsRead);
  const canManageRbacByPermission =
    hasEveryPermission([
      AdminPermission.RolesRead,
      AdminPermission.PermissionsRead,
    ]);

  const canProbe =
    !accessQuery.isLoading &&
    isPermissionUnknown;

  const contactsQuery = useContacts({
    enabled:
      canReadContactsByPermission || canProbe,
    suppressErrorLog:
      canProbe && !canReadContactsByPermission,
  });
  const grievancesQuery = useGrievances({
    enabled:
      canReadGrievancesByPermission || canProbe,
    suppressErrorLog:
      canProbe && !canReadGrievancesByPermission,
  });
  const usersQuery = useSignupUsers({
    enabled:
      canReadUsersByPermission || canProbe,
    suppressErrorLog:
      canProbe && !canReadUsersByPermission,
  });
  const rolesQuery = useRoles({
    enabled:
      canReadRolesByPermission || canProbe,
    suppressErrorLog:
      canProbe && !canReadRolesByPermission,
  });
  const permissionsQuery = usePermissions({
    enabled:
      canReadPermissionsByPermission || canProbe,
    suppressErrorLog:
      canProbe && !canReadPermissionsByPermission,
  });

  const canReadContacts =
    canReadContactsByPermission ||
    (canProbe && contactsQuery.isSuccess);
  const canReadGrievances =
    canReadGrievancesByPermission ||
    (canProbe && grievancesQuery.isSuccess);
  const canReadUsers =
    canReadUsersByPermission ||
    (canProbe && usersQuery.isSuccess);
  const canReadRoles =
    canReadRolesByPermission ||
    (canProbe && rolesQuery.isSuccess);
  const canReadPermissions =
    canReadPermissionsByPermission ||
    (canProbe && permissionsQuery.isSuccess);
  const canManageRbac =
    canManageRbacByPermission ||
    (canProbe &&
      rolesQuery.isSuccess &&
      permissionsQuery.isSuccess);

  const isProbeLoading =
    canProbe &&
    [
      contactsQuery,
      grievancesQuery,
      usersQuery,
      rolesQuery,
      permissionsQuery,
    ].some((query) => query.isLoading);

  return useMemo(
    () => ({
      accessQuery,
      isLoading:
        accessQuery.isLoading || isProbeLoading,
      canReadContacts,
      canReadGrievances,
      canReadUsers,
      canReadRoles,
      canReadPermissions,
      canManageRbac,
      queries: {
        contacts: contactsQuery,
        grievances: grievancesQuery,
        users: usersQuery,
        roles: rolesQuery,
        permissions: permissionsQuery,
      },
    }),
    [
      accessQuery,
      canManageRbac,
      canReadContacts,
      canReadGrievances,
      canReadPermissions,
      canReadRoles,
      canReadUsers,
      contactsQuery,
      grievancesQuery,
      isProbeLoading,
      permissionsQuery,
      rolesQuery,
      usersQuery,
    ]
  );
}
