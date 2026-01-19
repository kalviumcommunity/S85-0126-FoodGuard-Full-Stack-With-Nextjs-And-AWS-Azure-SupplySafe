/**
 * HYBRID RENDERING (ISR) - Incremental Static Regeneration
 *
 * This page combines the best of both worlds - static generation with periodic updates.
 * Perfect for content that changes occasionally but doesn't need real-time updates.
 *
 * Key Features:
 * - Fast initial load (served as static HTML)
 * - Automatic updates at specified intervals
 * - Balance between performance and freshness
 * - Reduced server load compared to SSR
 */

// Revalidate every 60 seconds - page will be regenerated after this time
export const revalidate = 60;

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
}

async function getNewsArticles() {
  // Simulating API call - this will be cached and revalidated every 60 seconds
  // Using default fetch (which caches by default in Next.js 13+)
  const timestamp = new Date().toISOString();
  const currentHour = new Date().getHours();

  // Simulate dynamic content that changes but not on every request
  const articles: NewsArticle[] = [
    {
      id: 1,
      title: "New FDA Guidelines for Food Traceability",
      excerpt:
        "The FDA has announced updated guidelines for food traceability, requiring enhanced documentation for high-risk foods.",
      category: "Compliance",
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      author: "Sarah Chen",
      readTime: "5 min",
    },
    {
      id: 2,
      title: "Blockchain Technology Revolutionizes Supply Chain",
      excerpt:
        "Major food retailers are adopting blockchain technology to improve transparency and reduce fraud in their supply chains.",
      category: "Technology",
      date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      author: "Michael Rodriguez",
      readTime: "7 min",
    },
    {
      id: 3,
      title: "Temperature Monitoring Best Practices",
      excerpt:
        "Learn the latest best practices for monitoring temperature-sensitive shipments to ensure food safety and compliance.",
      category: "Best Practices",
      date: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      author: "Emily Watson",
      readTime: "4 min",
    },
    {
      id: 4,
      title: `Food Safety Alert: ${currentHour > 12 ? "Afternoon" : "Morning"} Update`,
      excerpt:
        "Latest updates on food safety incidents and recalls across the industry. Stay informed and compliant.",
      category: "Alerts",
      date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      author: "FoodGuard Team",
      readTime: "3 min",
    },
  ];

  return {
    articles,
    lastUpdated: timestamp,
    nextUpdate: new Date(Date.now() + 60 * 1000).toISOString(),
  };
}

export default async function NewsPage() {
  const data = await getNewsArticles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                News & Updates
              </h1>
              <p className="text-gray-600 mt-1">
                Latest industry news and insights
              </p>
            </div>
            <span className="px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-semibold">
              Hybrid (ISR)
            </span>
          </div>

          {/* Revalidation Info */}
          <div className="bg-teal-50 border-l-4 border-teal-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>🔄 Rendering Mode:</strong> Incremental Static
              Regeneration (ISR)
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <strong>📅 Last Updated:</strong>{" "}
              {new Date(data.lastUpdated).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <strong>⏰ Next Update:</strong>{" "}
              {new Date(data.nextUpdate).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2 italic">
              This page is statically generated but revalidates every 60
              seconds. Fresh content with static performance!
            </p>
          </div>
        </div>

        {/* News Articles */}
        <div className="space-y-6 mb-6">
          {data.articles.map((article) => (
            <div
              key={article.id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    article.category === "Alerts"
                      ? "bg-red-100 text-red-800"
                      : article.category === "Compliance"
                        ? "bg-blue-100 text-blue-800"
                        : article.category === "Technology"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                  }`}
                >
                  {article.category}
                </span>
                <span className="text-sm text-gray-500">
                  {article.readTime} read
                </span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                {article.title}
              </h2>
              <p className="text-gray-600 mb-4">{article.excerpt}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                    {article.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {article.author}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(article.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Revalidation Status */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">
              Auto-refreshing content every 60 seconds
            </span>
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold mb-3">⚙️ Technical Details</h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Rendering:</strong> Hybrid (ISR) - Static with periodic
              regeneration
            </li>
            <li>
              ✅ <strong>Performance:</strong> Fast like static, fresh like
              dynamic
            </li>
            <li>
              ✅ <strong>Revalidation:</strong> Every 60 seconds (revalidate =
              60)
            </li>
            <li>
              ✅ <strong>Use Case:</strong> News sites, blogs, product catalogs,
              event pages
            </li>
            <li>
              ✅ <strong>Cost:</strong> Low - regenerates only when needed, not
              on every request
            </li>
            <li>
              ✅ <strong>Behavior:</strong> First request after 60s triggers
              background regeneration
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
