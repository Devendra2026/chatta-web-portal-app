"use client";

import { UsersRound } from "lucide-react";

import PermissionDeniedState from "@/components/admin/PermissionDeniedState";
import SignupUserTable from "@/components/admin/users/SignupUser-Table";
import { useAdminModuleAccess } from "@/hooks/use-admin-module-access";

export default function AdminSignupUsersPage() {
  const moduleAccess = useAdminModuleAccess();
  const usersQuery = moduleAccess.queries.users;
  const canReadUsers =
    moduleAccess.canReadUsers;
  const users = usersQuery.data ?? [];
  const isCheckingAccess =
    moduleAccess.accessQuery.isLoading ||
    (moduleAccess.accessQuery
      .isPermissionUnknown &&
      usersQuery.isLoading);

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <UsersRound className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-600">
                Admin Management
              </p>

              <h1 className="text-2xl font-bold text-slate-900">
                Signup Users
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View users captured from Clerk signup webhook.
              </p>
            </div>
          </div>

          {!isCheckingAccess &&
            canReadUsers &&
            !usersQuery.isLoading &&
            !usersQuery.isError && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2">
              <p className="text-xs font-semibold text-blue-600">
                Total Users
              </p>

              <p className="text-xl font-bold text-blue-900">
                {users.length}
              </p>
            </div>
          )}
        </div>

        {isCheckingAccess && (
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <p className="text-sm font-medium text-slate-500">
              Permissions checking...
            </p>
          </div>
        )}

        {!isCheckingAccess && !canReadUsers && (
          <PermissionDeniedState description="Signup users dekhne ke liye user:read permission assign honi chahiye." />
        )}

        {!isCheckingAccess &&
          canReadUsers &&
          usersQuery.isLoading && (
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Signup users loading...
              </p>
            </div>
          </div>
        )}

        {!isCheckingAccess &&
          canReadUsers &&
          usersQuery.isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-semibold text-red-700">
              Signup users load nahi ho pa rahe.
            </h2>

            <p className="mt-1 text-sm text-red-600">
              {usersQuery.error instanceof Error
                ? usersQuery.error.message
                : "Something went wrong"}
            </p>

            <button
              type="button"
              onClick={() => usersQuery.refetch()}
              disabled={usersQuery.isFetching}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {usersQuery.isFetching
                ? "Retrying..."
                : "Try Again"}
            </button>
          </div>
        )}

        {!isCheckingAccess &&
          canReadUsers &&
          !usersQuery.isLoading &&
          !usersQuery.isError && (
          <SignupUserTable data={users} />
        )}
      </div>
    </main>
  );
}
