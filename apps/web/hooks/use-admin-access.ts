"use client";

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";

import {
  getCurrentAdminRole,
  hasAdminPermission,
  hasEveryAdminPermission,
  isFullAccessAdminRole,
} from "@/services/admin-role-api";
import type {
  AdminAccess,
  AdminPermissionKey,
} from "@/types/admin-access";

export const adminAccessQueryKeys = {
  current: ["admin-access", "current"] as const,
};

async function requireAdminToken(
  getToken: () => Promise<string | null>
) {
  const token = await getToken();

  if (!token) {
    throw new Error(
      "Authentication token not found. Please sign in with an admin account."
    );
  }

  return token;
}

export function useAdminAccess() {
  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  const query = useQuery({
    queryKey: adminAccessQueryKeys.current,
    queryFn: async () => {
      const token =
        await requireAdminToken(getToken);

      return getCurrentAdminRole(token);
    },
    enabled:
      isLoaded &&
      isSignedIn === true,
    retry: false,
  });

  return useMemo(
    () => ({
      ...query,
      access: query.data as
        | AdminAccess
        | undefined,
      isPermissionUnknown: Boolean(
        query.data?.isAllowed &&
          !query.data.hasExplicitPermissions &&
          !isFullAccessAdminRole(query.data.role)
      ),
      hasPermission: (
        permission: AdminPermissionKey
      ) =>
        hasAdminPermission(
          query.data,
          permission
        ),
      hasEveryPermission: (
        permissions: AdminPermissionKey[]
      ) =>
        hasEveryAdminPermission(
          query.data,
          permissions
        ),
    }),
    [query]
  );
}
