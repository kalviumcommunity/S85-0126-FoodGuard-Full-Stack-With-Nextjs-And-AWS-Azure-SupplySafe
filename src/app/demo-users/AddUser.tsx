"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/lib/fetcher";

export default function AddUser() {
  const { data } = useSWR("/api/demo-users", fetcher);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addUser = async () => {
    if (!name || !email) return;

    // Optimistic update
    const optimisticUser = {
      id: Date.now(),
      name,
      email,
    };

    mutate(
      "/api/demo-users",
      [...(data || []), optimisticUser],
      false
    );

    // Actual API call
    try {
      await fetch("/api/demo-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      // Revalidate after update
      mutate("/api/demo-users");
      setName("");
      setEmail("");
    } catch (error) {
      // Revalidate on error to revert optimistic update
      mutate("/api/demo-users");
      console.error("Failed to add user:", error);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Add New User</h2>
      <div className="flex flex-col gap-2 max-w-sm">
        <input
          className="border px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter user name"
        />
        <input
          className="border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          type="email"
        />
        <button
          onClick={addUser}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Add User
        </button>
      </div>
    </div>
  );
}
