"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";

import { useUpdateSignupUserRole } from "@/hooks/use-signup-users";
import type {
  RoleOption,
  SignupUser,
} from "@/types/admin-user";

type SignupUserRoleSelectProps = {
  user: SignupUser;
  roleOptions: RoleOption[];
};

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Role update nahi ho paya";
}

function normalizeRole(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function getSelectedRoleValue(
  userRole: string,
  roleOptions: RoleOption[]
) {
  const normalizedUserRole =
    normalizeRole(userRole);

  const matchingRole = roleOptions.find(
    (roleOption) =>
      normalizeRole(roleOption.value) ===
        normalizedUserRole ||
      normalizeRole(roleOption.label) ===
        normalizedUserRole
  );

  return matchingRole?.value ?? userRole;
}

export default function SignupUserRoleSelect({
  user,
  roleOptions,
}: SignupUserRoleSelectProps) {
  const [error, setError] = useState("");
  const updateRoleMutation =
    useUpdateSignupUserRole();
  const selectedRoleValue = getSelectedRoleValue(
    user.role,
    roleOptions
  );

  const handleRoleChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const role = event.target.value;
    setError("");

    try {
      await updateRoleMutation.mutateAsync({
        user,
        role,
      });
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-1">
      <div className="relative inline-flex items-center">
        <select
          value={selectedRoleValue}
          onChange={handleRoleChange}
          disabled={updateRoleMutation.isPending}
          className="h-8 min-w-32 rounded-full border border-blue-100 bg-blue-50 px-3 pr-8 text-xs font-semibold text-blue-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {roleOptions.map((roleOption) => (
            <option
              key={roleOption.value}
              value={roleOption.value}
            >
              {roleOption.label}
            </option>
          ))}
        </select>

        {updateRoleMutation.isPending && (
          <Loader2 className="pointer-events-none absolute right-2 h-3.5 w-3.5 animate-spin text-blue-600" />
        )}
      </div>

      {error && (
        <p className="max-w-40 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
