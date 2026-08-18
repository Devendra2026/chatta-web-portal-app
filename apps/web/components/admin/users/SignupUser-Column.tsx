"use client"

import type { ColumnDef} from "@tanstack/react-table"

import type { RoleOption, SignupUser } from "@/types/admin-user"

import SignupUserActions from "./SignupUser-Actions"
import SignupUserRoleSelect from "./SignupUser-RoleSelect"

type SignupUserColumnPermissions = {
  canUpdateUsers: boolean
  canDeleteUsers: boolean
}

export function createSignupUserColumns(
  roleOptions: RoleOption[],
  permissions: SignupUserColumnPermissions
): ColumnDef<SignupUser>[] {
  return [
    {
      id: "serialNumber",
      header: "S.No.",
      cell: ({ row, table }) => (
        <span className="font-semibold text-slate-700">
          {table
            .getFilteredRowModel()
            .rows.findIndex((tableRow) => tableRow.id === row.id) + 1}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-semibold text-slate-900">
          {row.original.name || "Not provided"}
        </span>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-slate-700">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) =>
        permissions.canUpdateUsers ? (
          <SignupUserRoleSelect user={row.original} roleOptions={roleOptions} />
        ) : (
          <span className="text-sm font-semibold text-slate-700">
            {row.original.role || "User"}
          </span>
        ),
    },
    {
      accessorKey: "clerk_id",
      header: "Clerk ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-slate-700">
          {row.original.clerk_id}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <SignupUserActions
          user={row.original}
          canDeleteUser={permissions.canDeleteUsers}
        />
      ),
    },
  ]
}
