import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-200 px-4 text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-2">
        404 — Page Not Found
      </h1>
      <p className="text-gray-600 mb-6">Oops! This route doesn&apos;t exist.</p>
      <Link
        href="/"
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
      >
        Back to Home
      </Link>
    </main>
  );
}
