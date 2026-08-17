"use client";

import { useAuth } from "@clerk/nextjs";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createRole,
  deleteRole,
  getPermissions,
  getRoleById,
  getRoles,
  updateRole,
  updateRolePermissions,
} from "@/services/rbac-api";
import type {
  Role,
  RoleCreateData,
  RolePermissionsUpdateData,
  RoleUpdateData,
} from "@/types/rbac";

export const rbacQueryKeys = {
  permissions: ["rbac", "permissions"] as const,
  roles: ["rbac", "roles"] as const,
  roleDetail: (id: number) =>
    ["rbac", "roles", id] as const,
};

type AdminQueryOptions = {
  enabled?: boolean;
  suppressErrorLog?: boolean;
};

async function requireAdminToken(
  getToken: () => Promise<string | null>
) {
  const token = await getToken();

  if (!token) {
    throw new Error(
      "Authentication token not found. Please sign in with an admin account.."
    );
  }

  return token;
}

export function usePermissions(
  options: AdminQueryOptions = {}
) {
  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  return useQuery({
    queryKey: rbacQueryKeys.permissions,
    queryFn: async () => {
      const token =
        await requireAdminToken(getToken);

      return getPermissions(token, {
        suppressErrorLog:
          options.suppressErrorLog,
      });
    },
    enabled:
      isLoaded &&
      isSignedIn === true &&
      (options.enabled ?? true),
    retry: false,
  });
}

export function useRoles(
  options: AdminQueryOptions = {}
) {
  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  return useQuery({
    queryKey: rbacQueryKeys.roles,
    queryFn: async () => {
      const token =
        await requireAdminToken(getToken);

      return getRoles(token, {
        suppressErrorLog:
          options.suppressErrorLog,
      });
    },
    enabled:
      isLoaded &&
      isSignedIn === true &&
      (options.enabled ?? true),
    retry: false,
  });
}

export function useRole(
  id: number,
  options: AdminQueryOptions = {}
) {
  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  return useQuery({
    queryKey: rbacQueryKeys.roleDetail(id),
    queryFn: async () => {
      const token =
        await requireAdminToken(getToken);

      return getRoleById(id, token, {
        suppressErrorLog:
          options.suppressErrorLog,
      });
    },
    enabled:
      isLoaded &&
      isSignedIn === true &&
      id > 0 &&
      (options.enabled ?? true),
    retry: false,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<Role, Error, RoleCreateData>({
    mutationFn: async (data) => {
      const token =
        await requireAdminToken(getToken);

      return createRole(data, token);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roles,
      });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<
    Role,
    Error,
    {
      id: number;
      data: RoleUpdateData;
    }
  >({
    mutationFn: async ({ id, data }) => {
      const token =
        await requireAdminToken(getToken);

      return updateRole(id, data, token);
    },

    onSuccess: async (updatedRole) => {
      queryClient.setQueryData(
        rbacQueryKeys.roleDetail(updatedRole.id),
        updatedRole
      );

      await queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roles,
      });
    },
  });
}

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<
    Role,
    Error,
    {
      id: number;
      data: RolePermissionsUpdateData;
    }
  >({
    mutationFn: async ({ id, data }) => {
      const token =
        await requireAdminToken(getToken);

      return updateRolePermissions(id, data, token);
    },

    onSuccess: async (updatedRole) => {
      queryClient.setQueryData(
        rbacQueryKeys.roleDetail(updatedRole.id),
        updatedRole
      );

      await queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roles,
      });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      const token =
        await requireAdminToken(getToken);

      return deleteRole(id, token);
    },

    onSuccess: async (_, deletedRoleId) => {
      queryClient.removeQueries({
        queryKey:
          rbacQueryKeys.roleDetail(deletedRoleId),
      });

      await queryClient.invalidateQueries({
        queryKey: rbacQueryKeys.roles,
      });
    },
  });
}
