"use client";

import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { getCurrentAdminRole } from "@/services/admin-role-api";

export default function RoleRedirect() {
  const router = useRouter();
  const {
    getToken,
    isLoaded,
    isSignedIn,
  } = useAuth();

  useEffect(() => {
    let isActive = true;

    async function checkRole() {
      if (!isLoaded) {
        return;
      }

      if (!isSignedIn) {
        router.replace("/sign-in");
        return;
      }

      try {
        const token = await getToken();

        if (!token) {
          throw new Error(
            "Authentication token nahi mila"
          );
        }

        const roleCheck =
          await getCurrentAdminRole(token);

        if (!isActive) {
          return;
        }

        if (roleCheck.isAllowed) {
          router.replace("/admin");
          return;
        }

        router.replace("/");
      } catch (error) {
        if (isActive) {
          router.replace("/");
        }
      }
    }

    void checkRole();

    return () => {
      isActive = false;
    };
  }, [getToken, isLoaded, isSignedIn, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />
        <h1 className="mt-4 text-lg font-bold text-slate-900">
          Checking Access
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Please wait while your role is verified.
        </p>
      </div>
    </main>
  );
}
