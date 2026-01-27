"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useSWRConfig } from "swr";
import { useState } from "react";

export default function SWRDemoPage() {
  const { cache } = useSWRConfig();
  
  // Basic SWR usage with error handling and revalidation strategies
  const { data, error, isLoading, mutate } = useSWR("/api/demo-users", fetcher, {
    revalidateOnFocus: true,
    refreshInterval: 10000, // Auto-refresh every 10 seconds
    onErrorRetry: (_error, _key, _config, revalidate, { retryCount }) => {
      // Custom retry logic
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 2000);
    },
  });

  // Dynamic SWR key example
  const [userId, setUserId] = useState<number | null>(null);
  const { data: singleUser, error: singleUserError } = useSWR(
    userId ? `/api/demo-users/${userId}` : null,
    fetcher
  );

  const refreshData = () => {
    mutate("/api/demo-users");
  };

  const clearCache = () => {
    // Clear all cache entries
    for (const key of cache.keys()) {
      cache.delete(key);
    }
    refreshData();
  };

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">SWR Demo - Advanced Features</h1>
      
      {/* Cache Status */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Cache Status</h2>
        <div className="space-y-2">
          <p className="text-sm">
            <strong>Cache Keys:</strong> {Array.from(cache.keys()).join(", ") || "None"}
          </p>
          <p className="text-sm">
            <strong>Cache Size:</strong> {Array.from(cache.keys()).length} entries
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={refreshData}
              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
            >
              Refresh Data
            </button>
            <button
              onClick={clearCache}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
            >
              Clear Cache
            </button>
          </div>
        </div>
      </section>

      {/* Auto-refreshing User List */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Auto-refreshing User List (every 10s)
        </h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>Failed to load users. Retrying...</p>
          </div>
        )}
        {isLoading && <p>Loading...</p>}
        {data && (
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Last updated: {new Date().toLocaleTimeString()}
            </p>
            <ul className="space-y-2">
              {data.map((user: any) => (
                <li key={user.id} className="p-3 border border-gray-200 rounded">
                  <span className="font-medium">{user.name}</span> — {user.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Dynamic User Fetching */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Dynamic User Fetching</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Select User ID (1-3 for demo data):
          </label>
          <input
            type="number"
            min="1"
            max="3"
            value={userId || ""}
            onChange={(e) => setUserId(e.target.value ? parseInt(e.target.value) : null)}
            className="border px-3 py-2 rounded mr-2"
            placeholder="Enter user ID"
          />
          <button
            onClick={() => setUserId(null)}
            className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700"
          >
            Clear
          </button>
        </div>
        
        {singleUserError && (
          <p className="text-red-600">User not found or error occurred.</p>
        )}
        {singleUser && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h3 className="font-semibold mb-2">Selected User:</h3>
            <p><strong>Name:</strong> {singleUser.name}</p>
            <p><strong>Email:</strong> {singleUser.email}</p>
          </div>
        )}
      </section>

      {/* SWR Configuration Info */}
      <section className="p-4 bg-yellow-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Current SWR Configuration</h2>
        <ul className="text-sm space-y-1">
          <li>• <strong>revalidateOnFocus:</strong> true (refreshes when tab gains focus)</li>
          <li>• <strong>refreshInterval:</strong> 10000ms (auto-refresh every 10 seconds)</li>
          <li>• <strong>onErrorRetry:</strong> Custom logic (max 3 retries, 2s delay)</li>
          <li>• <strong>Optimistic Updates:</strong> Enabled in AddUser component</li>
        </ul>
      </section>
    </main>
  );
}
