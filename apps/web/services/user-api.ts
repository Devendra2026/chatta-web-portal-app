import { z } from "zod";

import { apiRequest } from "@/lib/api-clients";
import {
  roleSchema,
  signupUserSchema,
  type RoleOption,
  type SignupUser,
  type UpdateUserRoleData,
} from "@/types/admin-user";

const USER_ENDPOINT = "/api/user";
const ROLES_ENDPOINT = "/api/roles";

type ApiServiceOptions = {
  suppressErrorLog?: boolean;
};

export const defaultRoleOptions: RoleOption[] = [
  {
    value: "user",
    label: "User",
  },
  {
    value: "admin",
    label: "admin",
  },
  {
    value: "head_clerk",
    label: "Head clerk",
  },
  {
    value: "computer_operator",
    label: "computer operator",
  },
];

const allowedRoleLabels = new Map(
  defaultRoleOptions.flatMap((roleOption) => [
    [
      normalizeRole(roleOption.value),
      roleOption,
    ],
    [
      normalizeRole(roleOption.label),
      roleOption,
    ],
  ])
);

function normalizeRole(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function getUserEndpoint(id: number) {
  return `${USER_ENDPOINT.replace(/\/+$/, "")}/${id}`;
}

function getUserRoleEndpoint(id: number) {
  return `${getUserEndpoint(id)}/role`;
}

function toRoleOption(role: unknown): RoleOption | null {
  const parsedRole = roleSchema.safeParse(role);

  if (!parsedRole.success) {
    return null;
  }

  const value = parsedRole.data.key;

  if (!value) {
    return null;
  }

  return {
    value,
    label: parsedRole.data.name || value,
  };
}

function getAllowedRoleOption(
  roleOption: RoleOption
) {
  return (
    allowedRoleLabels.get(
      normalizeRole(roleOption.value)
    ) ??
    allowedRoleLabels.get(
      normalizeRole(roleOption.label)
    ) ??
    null
  );
}

export async function getSignupUsers(
  token?: string,
  options: ApiServiceOptions = {}
): Promise<SignupUser[]> {
  const response = await apiRequest<unknown>(
    USER_ENDPOINT,
    {
      token,
      suppressErrorLog:
        options.suppressErrorLog,
    }
  );

  return z.array(signupUserSchema).parse(response);
}

export async function getSignupUserById(
  id: number,
  token?: string,
  options: ApiServiceOptions = {}
): Promise<SignupUser> {
  const response = await apiRequest<unknown>(
    getUserEndpoint(id),
    {
      token,
      suppressErrorLog:
        options.suppressErrorLog,
    }
  );

  return signupUserSchema.parse(response);
}

export async function updateSignupUserRole(
  id: number,
  data: UpdateUserRoleData,
  token?: string
): Promise<SignupUser> {
  const response = await apiRequest<unknown>(
    getUserRoleEndpoint(id),
    {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }
  );

  return signupUserSchema.parse(response);
}

export async function deleteSignupUser(
  id: number,
  token?: string
): Promise<void> {
  await apiRequest<void>(
    getUserEndpoint(id),
    {
      method: "DELETE",
      token,
    }
  );
}

export async function getRoleOptions(
  token?: string,
  options: ApiServiceOptions = {}
): Promise<RoleOption[]> {
  const response = await apiRequest<unknown>(
    ROLES_ENDPOINT,
    {
      token,
      suppressErrorLog:
        options.suppressErrorLog,
    }
  );

  const roleOptions = z
    .array(z.unknown())
    .parse(response)
    .map(toRoleOption)
    .map((roleOption) =>
      roleOption
        ? getAllowedRoleOption(roleOption)
        : null
    )
    .filter(
      (role): role is RoleOption =>
        role !== null
    );

  const mergedOptions = [
    ...roleOptions,
    ...defaultRoleOptions,
  ];
  const seenRoles = new Set<string>();

  return mergedOptions.filter((roleOption) => {
    const roleKey = normalizeRole(roleOption.value);

    if (seenRoles.has(roleKey)) {
      return false;
    }

    seenRoles.add(roleKey);
    return true;
  });
}
