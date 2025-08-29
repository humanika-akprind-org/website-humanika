// app/dashboard/overview/page.tsx
export default function OverviewPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* Users Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-blue-600">124</p>
          <p className="text-sm text-green-500 mt-2">+12% from last month</p>
        </div>

        {/* Work Programs Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Work Programs
          </h2>
          <p className="text-3xl font-bold text-green-600">18</p>
          <p className="text-sm text-gray-500 mt-2">5 ongoing</p>
        </div>

        {/* Events Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Upcoming Events
          </h2>
          <p className="text-3xl font-bold text-purple-600">7</p>
          <p className="text-sm text-gray-500 mt-2">
            Next: Conference on Friday
          </p>
        </div>

        {/* Documents Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Documents
          </h2>
          <p className="text-3xl font-bold text-yellow-600">243</p>
          <p className="text-sm text-gray-500 mt-2">12 pending review</p>
        </div>

        {/* Finance Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Budget</h2>
          <p className="text-3xl font-bold text-red-600">$24,895</p>
          <p className="text-sm text-green-500 mt-2">+8% from last quarter</p>
        </div>

        {/* Letters Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Processed Letters
          </h2>
          <p className="text-3xl font-bold text-indigo-600">42</p>
          <p className="text-sm text-gray-500 mt-2">3 awaiting response</p>
        </div>

        {/* Articles Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Published Articles
          </h2>
          <p className="text-3xl font-bold text-pink-600">16</p>
          <p className="text-sm text-green-500 mt-2">+3 this month</p>
        </div>

        {/* Gallery Card */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Gallery Items
          </h2>
          <p className="text-3xl font-bold text-teal-600">87</p>
          <p className="text-sm text-gray-500 mt-2">Last added: Event photos</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-semibold">JD</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  John Doe updated organizational structure
                </p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-semibold">AS</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Alice Smith published a new article
                </p>
                <p className="text-sm text-gray-500">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-purple-600 font-semibold">RJ</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">
                  Robert Johnson uploaded event documents
                </p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            System Overview
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Active Period
              </span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                Q2 2023
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                External Links
              </span>
              <span className="text-sm text-gray-900">12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Pending Approvals
              </span>
              <span className="text-sm text-gray-900">8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                System Health
              </span>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                Optimal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
