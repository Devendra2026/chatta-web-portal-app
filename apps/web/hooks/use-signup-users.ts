"use client";

import { useAuth } from "@clerk/nextjs";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteSignupUser,
  getRoleOptions,
  getSignupUserById,
  getSignupUsers,
  updateSignupUserRole,
} from "@/services/user-api";
import type {
  SignupUser,
  UpdateUserRoleData,
} from "@/types/admin-user";

export const signupUserQueryKeys = {
  all: ["signup-users"] as const,
  roles: ["signup-users", "roles"] as const,
  detail: (id: number) =>
    ["signup-users", "detail", id] as const,
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
      "Authentication token not found. Please sign in with an admin account."
    );
  }

  return token;
}

export function useSignupUsers(
  options: AdminQueryOptions = {}
) {
  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  return useQuery({
    queryKey: signupUserQueryKeys.all,
    queryFn: async () => {
      const token =
        await requireAdminToken(getToken);

      return getSignupUsers(token, {
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

export function useSignupUser(
  id: number,
  options: AdminQueryOptions = {}
) {
  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  return useQuery({
    queryKey: signupUserQueryKeys.detail(id),
    queryFn: async () => {
      const token =
        await requireAdminToken(getToken);

      return getSignupUserById(id, token, {
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

export function useRoleOptions(
  options: AdminQueryOptions = {}
) {
  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  return useQuery({
    queryKey: signupUserQueryKeys.roles,
    queryFn: async () => {
      const token =
        await requireAdminToken(getToken);

      return getRoleOptions(token, {
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

export function useUpdateSignupUserRole() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<
    SignupUser,
    Error,
    {
      user: SignupUser;
      role: string;
    }
  >({
    mutationFn: async ({ user, role }) => {
      const token =
        await requireAdminToken(getToken);

      const data: UpdateUserRoleData = {
        name: user.name || "Not provided",
        role,
      };

      return updateSignupUserRole(
        user.id,
        data,
        token
      );
    },

    onSuccess: async (updatedUser) => {
      queryClient.setQueryData(
        signupUserQueryKeys.detail(updatedUser.id),
        updatedUser
      );

      queryClient.setQueryData<SignupUser[]>(
        signupUserQueryKeys.all,
        (currentUsers) =>
          currentUsers?.map((user) =>
            user.id === updatedUser.id
              ? updatedUser
              : user
          )
      );

      await queryClient.invalidateQueries({
        queryKey: signupUserQueryKeys.all,
      });
    },
  });
}

export function useDeleteSignupUser() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation<void, Error, number>({
    mutationFn: async (id) => {
      const token =
        await requireAdminToken(getToken);

      return deleteSignupUser(id, token);
    },

    onSuccess: async (_, deletedUserId) => {
      queryClient.removeQueries({
        queryKey:
          signupUserQueryKeys.detail(deletedUserId),
      });

      queryClient.setQueryData<SignupUser[]>(
        signupUserQueryKeys.all,
        (currentUsers) =>
          currentUsers?.filter(
            (user) => user.id !== deletedUserId
          )
      );

      await queryClient.invalidateQueries({
        queryKey: signupUserQueryKeys.all,
      });
    },
  });
}
