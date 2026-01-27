import { headers } from "next/headers";
import Link from "next/link";

const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getUsers() {
  const h = await headers();
  const cookie = h.get("cookie") ?? "";
  const res = await fetch(`${BASE}/api/users`, {
    cache: "no-store",
    headers: { cookie },
  });
  const json = await res.json();
  if (!json.success || !Array.isArray(json.data)) {
    return [];
  }
  return json.data as Array<{
    id: string;
    name: string;
    email?: string;
    role: string;
    createdAt: string;
  }>;
}

export default async function UsersListPage() {
  const users = await getUsers();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 p-6">
      <div className="max-w-3xl mx-auto">
        <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-indigo-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Users</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Users</h1>
        <p className="text-gray-600 mb-6">
          All registered users. Click to view profile.
        </p>
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u.id}>
              <Link
                href={`/users/${u.id}`}
                className="block rounded-lg bg-white px-4 py-3 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <span className="font-medium text-gray-900">{u.name}</span>
                {u.email && (
                  <span className="text-gray-500 text-sm ml-2">{u.email}</span>
                )}
                <span className="ml-2 text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                  {u.role}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {users.length === 0 && (
          <p className="text-gray-500 text-center py-8">No users found.</p>
        )}
      </div>
    </main>
  );
}
