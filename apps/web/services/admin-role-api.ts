import { apiRequest } from "@/lib/api-clients";
import type {
  AdminAccess,
  AdminPermissionKey,
} from "@/types/admin-access";

const ADMIN_ROLE_ENDPOINT =
  process.env.NEXT_PUBLIC_ADMIN_ROLE_ENDPOINT ??
  "/api/user/me";
const ROLES_ENDPOINT = "/api/roles";

const ALLOWED_ADMIN_ROLES = new Set([
  "admin",
  "head clerk",
  "computer operator",
]);

type AdminRoleCheck = {
  role: string | null;
  isAllowed: boolean;
};

export function normalizeRole(role: string) {
  return role
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function getObjectValue(
  data: Record<string, unknown>,
  keys: string[]
) {
  for (const key of keys) {
    const value = data[key];

    if (typeof value === "string") {
      return value;
    }
  }

  return null;
}

function getNumberValue(
  data: Record<string, unknown>,
  keys: string[]
) {
  for (const key of keys) {
    const value = data[key];

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const parsedValue = Number(value);

      if (Number.isFinite(parsedValue)) {
        return parsedValue;
      }
    }
  }

  return null;
}

function extractRole(data: unknown): string | null {
  if (
    typeof data !== "object" ||
    data === null
  ) {
    return null;
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const role = extractRole(item);

      if (role) {
        return role;
      }
    }

    return null;
  }

  const objectData =
    data as Record<string, unknown>;

  const directRole = getObjectValue(
    objectData,
    ["role", "role_name", "roleName", "user_role"]
  );

  if (directRole) {
    return directRole;
  }

  if (
    typeof objectData.role === "object" &&
    objectData.role !== null &&
    !Array.isArray(objectData.role)
  ) {
    const nestedRole = getObjectValue(
      objectData.role as Record<string, unknown>,
      ["role", "role_name", "roleName", "key", "name"]
    );

    if (nestedRole) {
      return nestedRole;
    }
  }

  const roles = objectData.roles;

  if (Array.isArray(roles)) {
    for (const role of roles) {
      if (typeof role === "string") {
        return role;
      }

      const extractedRole = extractRole(role);

      if (extractedRole) {
        return extractedRole;
      }
    }

    return null;
  }

  return (
    extractRole(objectData.role) ??
    extractRole(objectData.user) ??
    extractRole(objectData.data) ??
    extractRole(objectData.current_user)
  );
}

function getPermissionKey(
  permission: unknown
) {
  if (typeof permission === "string") {
    return permission;
  }

  if (
    typeof permission !== "object" ||
    permission === null
  ) {
    return null;
  }

  return getObjectValue(
    permission as Record<string, unknown>,
    ["key", "permission_key", "permissionKey"]
  );
}

function extractPermissionKeys(data: unknown) {
  const permissionKeys = new Set<string>();
  let hasExplicitPermissions = false;

  function visit(value: unknown, depth: number) {
    if (
      depth > 8 ||
      typeof value !== "object" ||
      value === null
    ) {
      return;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        visit(item, depth + 1);
      }

      return;
    }

    const objectValue =
      value as Record<string, unknown>;

    for (const key of [
      "permissions",
      "permission_keys",
      "permissionKeys",
    ]) {
      const rawPermissions = objectValue[key];

      if (!Array.isArray(rawPermissions)) {
        continue;
      }

      hasExplicitPermissions = true;

      for (const permission of rawPermissions) {
        const permissionKey =
          getPermissionKey(permission);

        if (permissionKey) {
          permissionKeys.add(
            permissionKey.trim().toLowerCase()
          );
        }
      }
    }

    visit(objectValue.role, depth + 1);
    visit(objectValue.user, depth + 1);
    visit(objectValue.data, depth + 1);
    visit(objectValue.current_user, depth + 1);
  }

  visit(data, 0);

  return {
    permissions: Array.from(permissionKeys),
    hasExplicitPermissions,
  };
}

function getRoleIdentifiers(roleData: unknown) {
  if (
    typeof roleData !== "object" ||
    roleData === null ||
    Array.isArray(roleData)
  ) {
    return [];
  }

  const objectData =
    roleData as Record<string, unknown>;
  const identifiers: string[] = [];

  for (const key of [
    "role",
    "role_name",
    "roleName",
    "key",
    "name",
  ]) {
    const value = objectData[key];

    if (
      typeof value === "string" &&
      value.trim()
    ) {
      identifiers.push(value);
    }
  }

  return identifiers;
}

async function getPermissionsForRole(
  token: string,
  role: string
) {
  try {
    const rolesResponse = await apiRequest<unknown>(
      ROLES_ENDPOINT,
      {
        method: "GET",
        token,
        cache: "no-store",
        suppressErrorLog: true,
      }
    );

    if (!Array.isArray(rolesResponse)) {
      return {
        foundRole: false,
        permissions: [] as string[],
      };
    }

    const normalizedCurrentRole =
      normalizeRole(role);
    const matchingRole = rolesResponse.find(
      (roleData) =>
        getRoleIdentifiers(roleData).some(
          (identifier) =>
            normalizeRole(identifier) ===
            normalizedCurrentRole
        )
    );

    if (!matchingRole) {
      return {
        foundRole: false,
        permissions: [] as string[],
      };
    }

    return {
      foundRole: true,
      permissions:
        extractPermissionKeys(matchingRole)
          .permissions,
    };
  } catch {
    return {
      foundRole: false,
      permissions: [] as string[],
    };
  }
}

function extractUserField(
  data: unknown,
  keys: string[]
) {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    return "";
  }

  return (
    getObjectValue(
      data as Record<string, unknown>,
      keys
    ) ?? ""
  );
}

function extractUserId(data: unknown) {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    return null;
  }

  return getNumberValue(
    data as Record<string, unknown>,
    ["id", "user_id", "userId"]
  );
}

export function isAllowedAdminRole(
  role: string | null | undefined
) {
  if (!role) {
    return false;
  }

  return ALLOWED_ADMIN_ROLES.has(
    normalizeRole(role)
  );
}

export function isFullAccessAdminRole(
  role: string | null | undefined
) {
  return role
    ? normalizeRole(role) === "admin"
    : false;
}

export function hasAdminPermission(
  access:
    | Pick<
        AdminAccess,
        "isAllowed" | "permissions" | "role"
      >
    | null
    | undefined,
  permission: AdminPermissionKey
) {
  if (!access?.isAllowed) {
    return false;
  }

  if (isFullAccessAdminRole(access.role)) {
    return true;
  }

  return access.permissions.includes(permission);
}

export function hasEveryAdminPermission(
  access:
    | Pick<
        AdminAccess,
        "isAllowed" | "permissions" | "role"
      >
    | null
    | undefined,
  permissions: AdminPermissionKey[]
) {
  return permissions.every((permission) =>
    hasAdminPermission(access, permission)
  );
}

export async function getCurrentAdminRole(
  token: string
): Promise<AdminAccess & AdminRoleCheck> {
  const response = await apiRequest<unknown>(
    ADMIN_ROLE_ENDPOINT,
    {
      method: "GET",
      token,
      cache: "no-store",
    }
  );

  const role = extractRole(response);
  let {
    permissions,
    hasExplicitPermissions,
  } = extractPermissionKeys(response);

  if (
    role &&
    isAllowedAdminRole(role) &&
    !hasExplicitPermissions &&
    !isFullAccessAdminRole(role)
  ) {
    const rolePermissions =
      await getPermissionsForRole(token, role);

    if (rolePermissions.foundRole) {
      permissions = rolePermissions.permissions;
      hasExplicitPermissions = true;
    }
  }

  return {
    id: extractUserId(response),
    clerkId: extractUserField(response, [
      "clerk_id",
      "clerkId",
    ]),
    name: extractUserField(response, ["name"]),
    email: extractUserField(response, ["email"]),
    role,
    permissions,
    hasExplicitPermissions,
    isAllowed: isAllowedAdminRole(role),
  };
}
