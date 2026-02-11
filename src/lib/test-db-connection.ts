// Test database connection
const DB_URL = "https://mdrqntpedztxxfcxsbxk.supabase.co/rest/v1";
const DB_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFudHBlZHp0eHhmY3hzYnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYxMDIsImV4cCI6MjA4NjIwMjEwMn0.N9MxcjKxuYho3dGOlMcd0fF3vtjjq-UTYCPwQLJ5hG0";

export async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...");

    // Test simple GET request
    const response = await fetch(`${DB_URL}/users?limit=1`, {
      headers: {
        "Content-Type": "application/json",
        apikey: DB_KEY,
        "Authorization": `Bearer ${DB_KEY}`
      },
    });

    console.log("📊 Response status:", response.status);
    console.log("📊 Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log("❌ Connection failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return false;
    }

    const data = await response.json();
    console.log("✅ Connection successful:", data);
    return true;
    
  } catch (error) {
    console.log("💥 Connection error:", error);
    return false;
  }
}

// Test in browser console
if (typeof window !== "undefined") {
  window.testDB = testDatabaseConnection;
  console.log("Run testDB() in console to test database connection");
}
