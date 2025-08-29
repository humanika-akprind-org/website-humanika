// app/dashboard/activity/page.tsx
export default function ActivityPage() {
  const activities = [
    {
      id: 1,
      user: "John Doe",
      action: "Updated organizational structure",
      service: "Organizational Structure",
      time: "2 hours ago",
      icon: "🏢",
      priority: "high",
    },
    {
      id: 2,
      user: "Alice Smith",
      action: "Published new article: Quarterly Report",
      service: "Article",
      time: "5 hours ago",
      icon: "📝",
      priority: "medium",
    },
    {
      id: 3,
      user: "Bob Johnson",
      action: "Uploaded financial documents for review",
      service: "Documents",
      time: "Yesterday",
      icon: "📊",
      priority: "high",
    },
    {
      id: 4,
      user: "Emma Wilson",
      action: "Created new work program: Community Outreach",
      service: "Work Programs",
      time: "2 days ago",
      icon: "📅",
      priority: "medium",
    },
    {
      id: 5,
      user: "Michael Brown",
      action: "Processed incoming official letter",
      service: "Letter",
      time: "3 days ago",
      icon: "✉️",
      priority: "medium",
    },
    {
      id: 6,
      user: "Sarah Davis",
      action: "Added new event: Annual Conference",
      service: "Events",
      time: "3 days ago",
      icon: "🎉",
      priority: "low",
    },
    {
      id: 7,
      user: "Robert Wilson",
      action: "Uploaded gallery images from last event",
      service: "Gallery",
      time: "4 days ago",
      icon: "🖼️",
      priority: "low",
    },
    {
      id: 8,
      user: "Lisa Anderson",
      action: "Updated financial records for Q2",
      service: "Finance",
      time: "4 days ago",
      icon: "💰",
      priority: "high",
    },
    {
      id: 9,
      user: "David Miller",
      action: "Added new external resource link",
      service: "Links",
      time: "5 days ago",
      icon: "🔗",
      priority: "low",
    },
    {
      id: 10,
      user: "Admin User",
      action: "Modified user permissions and roles",
      service: "Users",
      time: "1 week ago",
      icon: "👥",
      priority: "high",
    },
  ];

  const serviceFilters = [
    "All",
    "Users",
    "Work Programs",
    "Events",
    "Documents",
    "Letter",
    "Article",
    "Gallery",
    "Links",
    "Finance",
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Activity Log</h1>
        <div className="flex items-center space-x-4">
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Activities</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            Export Log
          </button>
        </div>
      </div>

      {/* Service Filters */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Filter by Service
        </h2>
        <div className="flex flex-wrap gap-2">
          {serviceFilters.map((service) => (
            <button
              key={service}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors"
            >
              {service}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Total Activities
            </h3>
            <span className="text-lg">📊</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">247</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">This Week</h3>
            <span className="text-lg">🔄</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">42</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Most Active</h3>
            <span className="text-lg">👤</span>
          </div>
          <p className="text-xl font-bold text-gray-800">John Doe</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Top Service</h3>
            <span className="text-lg">📝</span>
          </div>
          <p className="text-xl font-bold text-gray-800">Documents</p>
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">
            Recent Activities
          </h2>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>
        <ul className="divide-y divide-gray-200">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="p-6 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-lg">
                  {activity.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                        <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                          {activity.service}
                        </span>
                        {activity.priority === "high" && (
                          <span className="ml-2 text-xs font-normal px-2 py-0.5 bg-red-100 text-red-600 rounded-full">
                            Important
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.action}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );
}
