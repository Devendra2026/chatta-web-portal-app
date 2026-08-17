import type { ReactNode } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/adminSidebar";
import { getCurrentAdminRole } from "@/services/admin-role-api";

interface AdminlayoutProps{
  children: ReactNode;
}

export default async function AdminLayout({
  children,
}: AdminlayoutProps) {
  const authObject = await auth.protect();
  const token = await authObject.getToken();

  if (!token) {
    redirect("/sign-in");
  }

  let canAccessAdmin = false;

  try {
    const roleCheck =
      await getCurrentAdminRole(token);

    canAccessAdmin = roleCheck.isAllowed;
  } catch (error) {
    console.error("Admin role check failed:", error);
  }

  if (!canAccessAdmin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <AdminSidebar />
      <div className="min-w-0 flex-1">
        <AdminHeader />
        {children}
      </div>
    </div>
  );
}
