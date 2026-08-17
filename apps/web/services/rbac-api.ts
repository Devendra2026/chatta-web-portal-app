import { z } from "zod";

import { apiRequest } from "@/lib/api-clients";
import {
  permissionSchema,
  roleSchema,
  type Permission,
  type Role,
  type RoleCreateData,
  type RolePermissionsUpdateData,
  type RoleUpdateData,
} from "@/types/rbac";

const PERMISSIONS_ENDPOINT = "/api/permissions";
const ROLES_ENDPOINT = "/api/roles";

type ApiServiceOptions = {
  suppressErrorLog?: boolean;
};

function getRoleEndpoint(id: number) {
  return `${ROLES_ENDPOINT.replace(/\/+$/, "")}/${id}`;
}

function getRolePermissionsEndpoint(id: number) {
  return `${getRoleEndpoint(id)}/permissions`;
}

export async function getPermissions(
  token?: string,
  options: ApiServiceOptions = {}
): Promise<Permission[]> {
  const response = await apiRequest<unknown>(
    PERMISSIONS_ENDPOINT,
    {
      token,
      suppressErrorLog:
        options.suppressErrorLog,
    }
  );

  return z.array(permissionSchema).parse(response);
}

export async function getRoles(
  token?: string,
  options: ApiServiceOptions = {}
): Promise<Role[]> {
  const response = await apiRequest<unknown>(
    ROLES_ENDPOINT,
    {
      token,
      suppressErrorLog:
        options.suppressErrorLog,
    }
  );

  return z.array(roleSchema).parse(response);
}

export async function getRoleById(
  id: number,
  token?: string,
  options: ApiServiceOptions = {}
): Promise<Role> {
  const response = await apiRequest<unknown>(
    getRoleEndpoint(id),
    {
      token,
      suppressErrorLog:
        options.suppressErrorLog,
    }
  );

  return roleSchema.parse(response);
}

export async function createRole(
  data: RoleCreateData,
  token?: string
): Promise<Role> {
  const response = await apiRequest<unknown>(
    ROLES_ENDPOINT,
    {
      method: "POST",
      body: JSON.stringify(data),
      token,
    }
  );

  return roleSchema.parse(response);
}

export async function updateRole(
  id: number,
  data: RoleUpdateData,
  token?: string
): Promise<Role> {
  const response = await apiRequest<unknown>(
    getRoleEndpoint(id),
    {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }
  );

  return roleSchema.parse(response);
}

export async function updateRolePermissions(
  id: number,
  data: RolePermissionsUpdateData,
  token?: string
): Promise<Role> {
  const response = await apiRequest<unknown>(
    getRolePermissionsEndpoint(id),
    {
      method: "PUT",
      body: JSON.stringify(data),
      token,
    }
  );

  return roleSchema.parse(response);
}

export async function deleteRole(
  id: number,
  token?: string
): Promise<void> {
  await apiRequest<void>(
    getRoleEndpoint(id),
    {
      method: "DELETE",
      token,
    }
  );
}
