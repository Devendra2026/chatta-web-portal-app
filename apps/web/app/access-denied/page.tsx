import Link from "next/link";

export default function AccessDeniedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold text-red-600">
          Access Denied
        </p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">
          Admin dashboard permission nahi hai
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Database role admin, Head clerk, ya computer operator hona chahiye.
        </p>
        <Link
          href="/"
          className="mt-5 inline-flex h-9 items-center justify-center rounded-lg bg-blue-700 px-4 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
}
