import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getUser(id: string) {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";
  const res = await fetch(`${BASE}/api/users/${id}`, {
    cache: "no-store",
    headers: { cookie },
  });
  const json = await res.json();
  if (!json.success || !json.data) return null;
  return json.data as {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <div className="max-w-2xl mx-auto">
        <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-indigo-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/users" className="hover:text-indigo-600">
            Users
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{user.name}</span>
        </nav>
        <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            User Profile
          </h1>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="text-gray-900 font-mono text-sm">{user.id}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="text-gray-900">{user.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="text-gray-900">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Joined</dt>
              <dd className="text-gray-900">
                {new Date(user.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
          <p className="mt-6">
            <Link
              href="/users"
              className="text-indigo-600 hover:underline font-medium"
            >
              ← Back to Users
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
