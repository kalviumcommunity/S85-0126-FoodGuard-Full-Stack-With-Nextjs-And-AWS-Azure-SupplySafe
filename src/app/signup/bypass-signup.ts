// Alternative signup methods to bypass email rate limiting

export async function createManualUser(
  email: string,
  password: string,
  name: string,
  role: string
) {
  try {
    // Method 1: Try to insert directly into public.users table
    const response = await fetch("https://mdrqntpedztxxfcxsbxk.supabase.co/rest/v1/users", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFudHBlZHp0eHhmY3hzYnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYxMDIsImV4cCI6MjA4NjIwMjEwMn0.N9MxcjKxuYho3dGOlMcd0fF3vtjjq-UTYCPwQLJ5hG0",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFudHBlZHp0eHhmY3hzYnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYxMDIsImV4cCI6MjA4NjIwMjEwMn0.N9MxcjKxuYho3dGOlMcd0fF3vtjjq-UTYCPwQLJ5hG0"
        },
        body: JSON.stringify({
          email: email,
          name: name,
          role: role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      }
    );

    if (response.ok) {
      return { success: true, message: "User created manually" };
    } else {
      return { success: false, error: "Failed to create user manually" };
    }
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

export async function checkUserInPublicTable(email: string) {
  try {
    const response = await fetch(
      `https://mdrqntpedztxxfcxsbxk.supabase.co/rest/v1/users?email=eq.${email}`,
      {
        headers: {
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcnFudHBlZHp0eHhmY3hzYnhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MjYxMDIsImV4cCI6MjA4NjIwMjEwMn0.N9MxcjKxuYho3dGOlMcd0fF3vtjjq-UTYCPwQLJ5hG0"
      }
    );

    const data = await response.json();
    return { exists: data.length > 0, user: data[0] };
  } catch (error) {
    return { exists: false, error };
  }
}
