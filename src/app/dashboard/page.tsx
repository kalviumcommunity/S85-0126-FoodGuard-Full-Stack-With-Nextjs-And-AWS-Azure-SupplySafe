/**
 * DYNAMIC RENDERING (SSR) - Server-Side Rendering
 *
 * This page is generated on EVERY request for real-time data.
 * Perfect for user-specific content that changes frequently.
 *
 * Key Features:
 * - Always up-to-date data
 * - Real-time content
 * - Personalized per request
 * - No stale data
 */

// Force dynamic rendering - page will be generated on every request
export const dynamic = "force-dynamic";

interface Metric {
  id: string;
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
}

interface Activity {
  id: number;
  action: string;
  timestamp: string;
  user: string;
}

async function getLiveMetrics() {
  // Simulating real-time API call - fetched on EVERY REQUEST
  // Using cache: 'no-store' ensures data is never cached
  const response = await fetch(
    "https://worldtimeapi.org/api/timezone/Etc/UTC",
    {
      cache: "no-store",
    }
  );

  const timeData = await response.json();
  const timestamp = new Date().toISOString();
  const requestTime = new Date(timeData.datetime).toLocaleTimeString();

  // Simulate real-time metrics
  const activeUsers = Math.floor(Math.random() * 1000) + 500;
  const alertsToday = Math.floor(Math.random() * 50) + 10;
  const complianceScore = (95 + Math.random() * 5).toFixed(1);

  return {
    timestamp,
    requestTime,
    metrics: [
      {
        id: "users",
        label: "Active Users",
        value: activeUsers,
        change: "+12.5%",
        trend: "up" as const,
      },
      {
        id: "alerts",
        label: "Alerts Today",
        value: alertsToday,
        change: "-8.2%",
        trend: "down" as const,
      },
      {
        id: "compliance",
        label: "Compliance Score",
        value: `${complianceScore}%`,
        change: "+2.1%",
        trend: "up" as const,
      },
      {
        id: "shipments",
        label: "Active Shipments",
        value: Math.floor(Math.random() * 200) + 100,
        change: "+5.7%",
        trend: "up" as const,
      },
    ] as Metric[],
    recentActivity: [
      {
        id: 1,
        action: "New shipment created",
        timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
        user: "John Doe",
      },
      {
        id: 2,
        action: "Temperature alert resolved",
        timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
        user: "Sarah Chen",
      },
      {
        id: 3,
        action: "Quality inspection passed",
        timestamp: new Date(Date.now() - 30 * 60000).toLocaleTimeString(),
        user: "Mike Rodriguez",
      },
      {
        id: 4,
        action: "Supplier verified",
        timestamp: new Date(Date.now() - 45 * 60000).toLocaleTimeString(),
        user: "Emily Watson",
      },
    ] as Activity[],
  };
}

export default async function DashboardPage() {
  const data = await getLiveMetrics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Real-time monitoring and analytics
              </p>
            </div>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              Dynamic (SSR)
            </span>
          </div>

          {/* Render Info */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>⚡ Rendering Mode:</strong> Server-Side Rendering (SSR)
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <strong>🕒 Generated at:</strong> {data.timestamp}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <strong>🌐 API Time:</strong> {data.requestTime}
            </p>
            <p className="text-sm text-gray-500 mt-2 italic">
              This page is generated on EVERY request. Refresh to see real-time
              updates!
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {data.metrics.map((metric) => (
            <div
              key={metric.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <p className="text-sm text-gray-600 mb-2">{metric.label}</p>
              <p className="text-3xl font-bold text-gray-800 mb-2">
                {metric.value}
              </p>
              <div className="flex items-center">
                <span
                  className={`text-sm font-semibold ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {metric.trend === "up" ? "↑" : "↓"} {metric.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {data.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-gray-200 pb-3"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">
                  {activity.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">
              System Status: All services operational
            </span>
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-3">⚙️ Technical Details</h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Rendering:</strong> Dynamic (server-side on every
              request)
            </li>
            <li>
              ✅ <strong>Performance:</strong> Real-time - always fresh data
            </li>
            <li>
              ✅ <strong>Caching:</strong> None (cache: 'no-store')
            </li>
            <li>
              ✅ <strong>Use Case:</strong> User dashboards, analytics, live
              feeds, personalized content
            </li>
            <li>
              ✅ <strong>Cost:</strong> Higher server costs - generates on every
              request
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
