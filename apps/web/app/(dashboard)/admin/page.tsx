"use client";

import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  MessageSquareText,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

import AdminStatCard from "@/components/admin/AdminStatCard";
import { useAdminModuleAccess } from "@/hooks/use-admin-module-access";

export default function AdminDashboardPage() {
  const {
    canReadContacts,
    canReadGrievances,
    canReadUsers,
    canReadRoles,
    canManageRbac,
    isLoading: isAccessLoading,
    queries,
  } = useAdminModuleAccess();
  const contacts = queries.contacts.data ?? [];
  const grievances =
    queries.grievances.data ?? [];
  const signupUsers = queries.users.data ?? [];
  const roles = queries.roles.data ?? [];
  const hasDashboardModules =
    canReadContacts ||
    canReadGrievances ||
    canReadUsers ||
    canReadRoles ||
    canManageRbac;

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-blue-600">
           Nagar Panchayat, Chhata , Mathura, Uttar Pradesh
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage contact submissions, public grievances, signed-up users, and
            access control from here.
          </p>
        </div>
        {/* Stat card */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {canReadContacts && (
            <AdminStatCard
              title="Total Contacts"
              value={contacts.length}
              description="Contact form submissions"
              icon={MessageSquareText}
              iconClassName="bg-blue-100 text-blue-600"
            />
          )}

          {canReadGrievances && (
            <AdminStatCard
              title="Total Grievances"
              value={grievances.length}
              description="Public grievance submissions"
              icon={TriangleAlert}
              iconClassName="bg-purple-100 text-purple-600"
            />
          )}

          {canReadUsers && (
            <AdminStatCard
              title="Signup Users"
              value={signupUsers.length}
              description="Clerk webhook users"
              icon={UsersRound}
              iconClassName="bg-indigo-100 text-indigo-600"
            />
          )}

          {canReadRoles && (
            <AdminStatCard
              title="Roles"
              value={roles.length}
              description="Database permission roles"
              icon={KeyRound}
              iconClassName="bg-fuchsia-100 text-fuchsia-600"
            />
          )}
        </div>

        {isAccessLoading && (
          <div className="mt-8 flex min-h-[220px] items-center justify-center rounded-xl border border-slate-200 bg-white">
            <p className="text-sm font-medium text-slate-500">
              Permissions checking...
            </p>
          </div>
        )}

        {/* Management cards */}
        {!isAccessLoading && (
          <div className="mt-8 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {/* Contact card */}
          {canReadContacts && (
            <Link
              href="/admin/contacts"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <MessageSquareText className="h-6 w-6" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Contact Submissions
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View enquiries received from the website contact form in a
                table.
              </p>

              <p className="mt-5 text-sm font-semibold text-blue-600">
                View contacts
              </p>
            </Link>
          )}

          {/* Grievance card */}
          {canReadGrievances && (
            <Link
              href="/admin/grievances"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <TriangleAlert className="h-6 w-6" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-purple-600" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Public Grievances
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View public grievances submitted by citizens in a table.
              </p>

              <p className="mt-5 text-sm font-semibold text-purple-600">
                View grievances
              </p>
            </Link>
          )}

          {/* Signup users card */}
          {canReadUsers && (
            <Link
              href="/admin/users"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <UsersRound className="h-6 w-6" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-indigo-600" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Signup Users
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View users saved through the Clerk signup webhook.
              </p>

              <p className="mt-5 text-sm font-semibold text-indigo-600">
                View users
              </p>
            </Link>
          )}

          {/* Roles permissions card */}
          {canManageRbac && (
            <Link
              href="/admin/roles-permissions"
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-fuchsia-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-fuchsia-100 text-fuchsia-600">
                  <KeyRound className="h-6 w-6" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1 group-hover:text-fuchsia-600" />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                Roles & Permissions
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create database roles and decide which operations each role can
                perform.
              </p>

              <p className="mt-5 text-sm font-semibold text-fuchsia-600">
                Manage roles
              </p>
            </Link>
          )}
          </div>
        )}

        {!isAccessLoading && !hasDashboardModules && (
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
            <h2 className="text-lg font-bold text-amber-900">
              Could not find any dashboard module assigned to this account.
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-amber-700">
              Assign read permission for contacts, grievances, users, or roles to this account's role to view the dashboard modules.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
