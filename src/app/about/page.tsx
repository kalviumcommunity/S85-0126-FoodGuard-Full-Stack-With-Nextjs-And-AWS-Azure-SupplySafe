/**
 * STATIC RENDERING (SSG) - Static Site Generation
 *
 * This page is pre-rendered at build time and served as static HTML.
 * Perfect for content that doesn't change frequently.
 *
 * Key Features:
 * - Fastest page load times (pre-built HTML)
 * - Reduced server load
 * - Great for SEO
 * - Content cached by CDN
 */

// Force static rendering - page will be generated at build time
export const revalidate = false;

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
}

async function getStaticContent() {
  // Simulating API call - in production, this would fetch from a CMS or database
  // This data is fetched at BUILD TIME only
  const timestamp = new Date().toISOString();

  return {
    title: "About FoodGuard",
    description: "Ensuring food safety and supply chain transparency",
    mission:
      "Our mission is to revolutionize food safety by providing comprehensive supply chain tracking and management solutions.",
    team: [
      {
        id: 1,
        name: "Madhav Garg",
        role: "CEO & Founder",
        bio: "10+ years in food safety and supply chain management",
      },
      {
        id: 2,
        name: "Sanya Jain",
        role: "CTO",
        bio: "Expert in blockchain and traceability systems",
      },
      {
        id: 3,
        name: "Nikunj Kohli",
        role: "Head of Operations",
        bio: "Specialist in compliance and quality assurance",
      },
    ] as TeamMember[],
    buildTimestamp: timestamp,
  };
}

export default async function AboutPage() {
  const content = await getStaticContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-800">
              {content.title}
            </h1>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Static (SSG)
            </span>
          </div>
          <p className="text-lg text-gray-600 mb-4">{content.description}</p>

          {/* Build Info */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <p className="text-sm text-gray-700">
              <strong>🏗️ Rendering Mode:</strong> Static Site Generation (SSG)
            </p>
            <p className="text-sm text-gray-700 mt-1">
              <strong>📅 Built at:</strong> {content.buildTimestamp}
            </p>
            <p className="text-sm text-gray-500 mt-2 italic">
              This page was pre-rendered at build time. Refresh the page - the
              timestamp won't change!
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed">{content.mission}</p>
        </div>

        {/* Team */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Meet Our Team
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {content.team.map((member) => (
              <div
                key={member.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">
                  {member.name}
                </h3>
                <p className="text-sm text-indigo-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Info */}
        <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-bold mb-3">⚙️ Technical Details</h3>
          <ul className="space-y-2 text-sm">
            <li>
              ✅ <strong>Rendering:</strong> Static (pre-rendered at build time)
            </li>
            <li>
              ✅ <strong>Performance:</strong> Fastest - served as static HTML
            </li>
            <li>
              ✅ <strong>Revalidation:</strong> None (revalidate = false)
            </li>
            <li>
              ✅ <strong>Use Case:</strong> Content that rarely changes (About,
              Blog posts, Marketing pages)
            </li>
            <li>
              ✅ <strong>Cost:</strong> Lowest server costs - no runtime
              rendering
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
