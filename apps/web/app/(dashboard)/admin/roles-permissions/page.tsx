"use client";

import { KeyRound } from "lucide-react";

import PermissionDeniedState from "@/components/admin/PermissionDeniedState";
import RolesPermissionsManager from "@/components/admin/rbac/RolesPermissionsManager";
import { useAdminModuleAccess } from "@/hooks/use-admin-module-access";

export default function AdminRolesPermissionsPage() {
  const moduleAccess = useAdminModuleAccess();
  const canManageRbac =
    moduleAccess.canManageRbac;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <KeyRound className="h-6 w-6" />
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-600">
                Access Control
              </p>

              <h1 className="text-2xl font-bold text-slate-900">
                Roles & Permissions
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Database roles, permissions, and dashboard access settings.
              </p>
            </div>
          </div>
        </div>

        {moduleAccess.isLoading && (
          <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-slate-200 bg-white">
            <p className="text-sm font-medium text-slate-500">
              Permissions checking...
            </p>
          </div>
        )}

        {!moduleAccess.isLoading && !canManageRbac && (
          <PermissionDeniedState description="Roles & permissions dekhne ke liye role:read permission assign honi chahiye." />
        )}

        {!moduleAccess.isLoading && canManageRbac && (
          <RolesPermissionsManager />
        )}
      </div>
    </main>
  );
}
