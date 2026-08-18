"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ExternalLink,
  KeyRound,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

import { useAdminModuleAccess } from "@/hooks/use-admin-module-access";
import {
  AdminPermission,
  type AdminPermissionKey,
} from "@/types/admin-access";

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Contact Submissions",
    href: "/admin/contacts",
    icon: MessageSquareText,
    permissions: [AdminPermission.ContactsRead],
  },
  {
    title: "Public Grievances",
    href: "/admin/grievances",
    icon: TriangleAlert,
    permissions: [AdminPermission.GrievancesRead],
  },
  {
    title: "Signup Users",
    href: "/admin/users",
    icon: UsersRound,
    permissions: [AdminPermission.UsersRead],
  },
  {
    title: "Roles & Permissions",
    href: "/admin/roles-permissions",
    icon: KeyRound,
    permissions: [
      AdminPermission.RolesRead,
      AdminPermission.PermissionsRead,
    ],
  },
] satisfies Array<{
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  permissions?: AdminPermissionKey[];
}>;

export default function AdminSidebar() {
  const pathname = usePathname();
  const moduleAccess = useAdminModuleAccess();
  const visibleLinks = sidebarLinks.filter(
    (link) => {
      if (!link.permissions) {
        return true;
      }

      if (link.href === "/admin/contacts") {
        return moduleAccess.canReadContacts;
      }

      if (link.href === "/admin/grievances") {
        return moduleAccess.canReadGrievances;
      }

      if (link.href === "/admin/users") {
        return moduleAccess.canReadUsers;
      }

      if (
        link.href === "/admin/roles-permissions"
      ) {
        return moduleAccess.canManageRbac;
      }

      return false;
    }
  );

  return (
    <aside className="hidden min-h-screen w-64 flex-col border-r border-slate-200 bg-white lg:flex">
      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-5">
      <img
        src="https://cdn.s3waas.gov.in/s30336dcbab05b9d5ad24f4333c7658a0e/uploads/2018/02/2018021632.png"
        alt="Town Panchayat Aminagar Sarai logo"
         className="h-11 w-11 rounded-xl object-contain"
          />

        <div>
          <h2 className="font-bold text-slate-900">
            Nagar Panchayat , Chhata , Mathura , Uttar Pradesh
          </h2>

          <p className="text-xs text-slate-500">
            Administration Panel
          </p>
        </div>
      </div>

      {/* Links */}
      <nav className="flex-1 space-y-2 p-4">
        {visibleLinks.map((link) => {
          const Icon = link.icon;

          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon className="h-5 w-5" />

              {link.title}
            </Link>
          );
        })}
      </nav>

      {/* Back to website */}
      <div className="border-t border-slate-200 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
        >
          <ExternalLink className="h-5 w-5" />

          Back to Website
        </Link>
      </div>
    </aside>
  );
}
