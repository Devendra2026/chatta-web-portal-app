import Link from "next/link";
import { ShieldAlert } from "lucide-react";

type PermissionDeniedStateProps = {
  title?: string;
  description?: string;
};

export default function PermissionDeniedState({
  title = " No Permission ",
  description = "You need the required permission assigned to your role to access this section.",
}: PermissionDeniedStateProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
      <ShieldAlert className="mx-auto h-10 w-10 text-amber-600" />
      <h2 className="mt-3 text-lg font-bold text-amber-900">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-amber-700">
        {description}
      </p>
      <Link
        href="/admin"
        className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-amber-600 px-4 text-sm font-semibold text-white transition hover:bg-amber-700"
      >
        Dashboard
      </Link>
    </div>
  );
}
