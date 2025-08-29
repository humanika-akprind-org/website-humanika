// app/dashboard/stats/page.tsx
export default function StatsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        System Statistics
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Total Users
          </h2>
          <p className="text-3xl font-bold text-blue-600">124</p>
          <p className="text-sm text-green-500 mt-2">+12% from last month</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Active Programs
          </h2>
          <p className="text-3xl font-bold text-green-600">18</p>
          <p className="text-sm text-gray-500 mt-2">5 nearing completion</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Documents Processed
          </h2>
          <p className="text-3xl font-bold text-purple-600">243</p>
          <p className="text-sm text-gray-500 mt-2">12 pending review</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Budget Utilization
          </h2>
          <p className="text-3xl font-bold text-red-600">78%</p>
          <p className="text-sm text-gray-500 mt-2">$24,895 of $31,900</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Types Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Document Types Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Reports
                </span>
                <span className="text-sm font-medium text-gray-700">42%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "42%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Proposals
                </span>
                <span className="text-sm font-medium text-gray-700">28%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: "28%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Letters
                </span>
                <span className="text-sm font-medium text-gray-700">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-600 h-2 rounded-full"
                  style={{ width: "15%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Financial Records
                </span>
                <span className="text-sm font-medium text-gray-700">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-600 h-2 rounded-full"
                  style={{ width: "10%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Others
                </span>
                <span className="text-sm font-medium text-gray-700">5%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: "5%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* System Performance Metrics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            System Performance Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-700">User Activity</p>
              <p className="text-2xl font-bold text-blue-700">84.2%</p>
              <p className="text-xs text-blue-600">Active in last 7 days</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">Task Completion</p>
              <p className="text-2xl font-bold text-green-700">76.5%</p>
              <p className="text-xs text-green-600">On-time completion rate</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-700">Document Processing</p>
              <p className="text-2xl font-bold text-purple-700">2.4 days</p>
              <p className="text-xs text-purple-600">Avg. processing time</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700">System Uptime</p>
              <p className="text-2xl font-bold text-red-700">99.8%</p>
              <p className="text-xs text-red-600">Last 30 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Activities Chart */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Monthly Activities
          </h2>
          <select className="px-3 py-1 border border-gray-300 rounded-md text-sm">
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>Year to date</option>
          </select>
        </div>
        <div className="flex items-end h-64 space-x-1">
          {[40, 55, 65, 50, 70, 85, 75, 80, 90, 95, 85, 100].map(
            (height, index) => (
              <div key={index} className="flex flex-col items-center flex-1">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-500 mt-2">
                  {
                    [
                      "J",
                      "F",
                      "M",
                      "A",
                      "M",
                      "J",
                      "J",
                      "A",
                      "S",
                      "O",
                      "N",
                      "D",
                    ][index]
                  }
                </span>
              </div>
            )
          )}
        </div>
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"/>
            <span className="text-sm text-gray-600">Documents Created</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"/>
            <span className="text-sm text-gray-600">Work Programs</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"/>
            <span className="text-sm text-gray-600">User Activities</span>
          </div>
        </div>
      </div>

      {/* Service Usage Statistics */}
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Service Usage Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">42</div>
            <div className="text-sm text-gray-600">Documents</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">18</div>
            <div className="text-sm text-gray-600">Work Programs</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">7</div>
            <div className="text-sm text-gray-600">Events</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-1">24</div>
            <div className="text-sm text-gray-600">Articles</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Letters</div>
          </div>
        </div>
      </div>
    </div>
  );
}
