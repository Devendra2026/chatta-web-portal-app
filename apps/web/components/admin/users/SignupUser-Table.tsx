"use client";

import { useMemo } from "react";

import DataTable from "@/components/admin/DataTable";
import {
  defaultRoleOptions,
} from "@/services/user-api";
import { useAdminAccess } from "@/hooks/use-admin-access";
import { useRoleOptions } from "@/hooks/use-signup-users";
import { AdminPermission } from "@/types/admin-access";
import type {
  RoleOption,
  SignupUser,
} from "@/types/admin-user";

import { createSignupUserColumns } from "./SignupUser-Column";

type SignupUserTableProps = {
  data: SignupUser[];
};

function normalizeRole(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function mergeRoleOptions(
  roleOptions: RoleOption[],
  users: SignupUser[]
) {
  const mergedOptions: RoleOption[] = [];
  const seenRoles = new Set<string>();

  mergedOptions.push(
    ...roleOptions,
    ...defaultRoleOptions
  );

  return mergedOptions.filter((roleOption) => {
    const key = normalizeRole(roleOption.value);

    if (!key || seenRoles.has(key)) {
      return false;
    }

    seenRoles.add(key);
    return true;
  });
}

export default function SignupUserTable({
  data,
}: SignupUserTableProps) {
  const { hasPermission } = useAdminAccess();
  const canUpdateUsers = hasPermission(
    AdminPermission.UsersUpdate
  );
  const canDeleteUsers = hasPermission(
    AdminPermission.UsersDelete
  );
  const roleOptionsQuery = useRoleOptions({
    enabled: canUpdateUsers,
  });

  const roleOptions = useMemo(
    () =>
      mergeRoleOptions(
        roleOptionsQuery.data ?? defaultRoleOptions,
        data
      ),
    [data, roleOptionsQuery.data]
  );

  const columns = useMemo(
    () =>
      createSignupUserColumns(roleOptions, {
        canUpdateUsers,
        canDeleteUsers,
      }),
    [
      canDeleteUsers,
      canUpdateUsers,
      roleOptions,
    ]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="Search by name, email, role or Clerk ID"
      emptyMessage="No signup users found"
    />
  );
}
