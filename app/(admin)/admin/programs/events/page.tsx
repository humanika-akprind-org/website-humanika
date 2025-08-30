// app/dashboard/events/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiCalendar,
  FiDollarSign,
  FiPieChart,
  FiClock,
  FiX,
  FiChevronDown,
  FiUser,
  FiBookOpen,
  FiTrendingUp,
  FiArchive,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

interface Event {
  id: string;
  name: string;
  description: string;
  responsibleId: string;
  responsibleName: string;
  goal: string;
  department: string;
  periodId: string;
  periodName: string;
  startDate: string;
  endDate: string;
  funds: number;
  usedFunds: number;
  remainingFunds: number;
  thumbnail?: string;
  status: "DRAFT" | "ONGOING" | "COMPLETED" | "CANCELLED";
  workProgramId?: string;
  workProgramName?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EventAllPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Annual Tech Conference",
      description: "Annual technology conference for industry professionals",
      responsibleId: "1",
      responsibleName: "John Doe",
      goal: "Knowledge sharing and networking",
      department: "IT",
      periodId: "1",
      periodName: "Q4 2023",
      startDate: "2023-11-15T09:00:00",
      endDate: "2023-11-17T17:00:00",
      funds: 50000,
      usedFunds: 32500,
      remainingFunds: 17500,
      thumbnail: "/tech-conf.jpg",
      status: "ONGOING",
      workProgramId: "1",
      workProgramName: "Technology Innovation",
      createdAt: "2023-08-10T14:30:00",
      updatedAt: "2023-11-01T10:15:00",
    },
    {
      id: "2",
      name: "Marketing Workshop",
      description: "Digital marketing strategies workshop",
      responsibleId: "2",
      responsibleName: "Alice Smith",
      goal: "Train marketing team on latest strategies",
      department: "Marketing",
      periodId: "1",
      periodName: "Q4 2023",
      startDate: "2023-11-20T09:00:00",
      endDate: "2023-11-21T16:00:00",
      funds: 15000,
      usedFunds: 8500,
      remainingFunds: 6500,
      status: "DRAFT",
      workProgramId: "2",
      workProgramName: "Market Expansion",
      createdAt: "2023-10-05T11:20:00",
      updatedAt: "2023-10-25T15:45:00",
    },
    {
      id: "3",
      name: "Financial Planning Seminar",
      description: "Annual financial planning and budgeting seminar",
      responsibleId: "3",
      responsibleName: "Robert Johnson",
      goal: "Plan next year's budget and financial strategy",
      department: "Finance",
      periodId: "1",
      periodName: "Q4 2023",
      startDate: "2023-12-05T10:00:00",
      endDate: "2023-12-06T15:00:00",
      funds: 20000,
      usedFunds: 0,
      remainingFunds: 20000,
      status: "DRAFT",
      workProgramId: "3",
      workProgramName: "Financial Management",
      createdAt: "2023-09-15T09:30:00",
      updatedAt: "2023-09-15T09:30:00",
    },
    {
      id: "4",
      name: "HR Recruitment Fair",
      description: "Annual recruitment fair for new talents",
      responsibleId: "4",
      responsibleName: "Emily Wilson",
      goal: "Hire 50 new employees across departments",
      department: "HR",
      periodId: "1",
      periodName: "Q4 2023",
      startDate: "2023-10-10T09:00:00",
      endDate: "2023-10-11T17:00:00",
      funds: 30000,
      usedFunds: 30000,
      remainingFunds: 0,
      status: "COMPLETED",
      workProgramId: "4",
      workProgramName: "Talent Acquisition",
      createdAt: "2023-07-20T14:15:00",
      updatedAt: "2023-10-15T16:30:00",
    },
    {
      id: "5",
      name: "Product Launch Event",
      description: "Launch of new product line",
      responsibleId: "5",
      responsibleName: "Michael Brown",
      goal: "Successful launch of new products",
      department: "Operations",
      periodId: "1",
      periodName: "Q4 2023",
      startDate: "2023-09-25T14:00:00",
      endDate: "2023-09-25T18:00:00",
      funds: 45000,
      usedFunds: 45000,
      remainingFunds: 0,
      thumbnail: "/product-launch.jpg",
      status: "COMPLETED",
      workProgramId: "5",
      workProgramName: "Product Development",
      createdAt: "2023-06-10T10:45:00",
      updatedAt: "2023-09-30T12:20:00",
    },
    {
      id: "6",
      name: "Q3 Town Hall Meeting",
      description: "Quarterly all-hands meeting",
      responsibleId: "6",
      responsibleName: "Sarah Davis",
      goal: "Update employees on company progress",
      department: "Executive",
      periodId: "2",
      periodName: "Q3 2023",
      startDate: "2023-08-15T14:00:00",
      endDate: "2023-08-15T16:00:00",
      funds: 5000,
      usedFunds: 4200,
      remainingFunds: 800,
      status: "COMPLETED",
      createdAt: "2023-07-01T08:30:00",
      updatedAt: "2023-08-20T09:15:00",
    },
    {
      id: "7",
      name: "Team Building Retreat",
      description: "Annual team building activities",
      responsibleId: "7",
      responsibleName: "David Miller",
      goal: "Improve team collaboration and morale",
      department: "HR",
      periodId: "2",
      periodName: "Q3 2023",
      startDate: "2023-07-20T08:00:00",
      endDate: "2023-07-22T16:00:00",
      funds: 25000,
      usedFunds: 18000,
      remainingFunds: 7000,
      status: "CANCELLED",
      workProgramId: "6",
      workProgramName: "Employee Engagement",
      createdAt: "2023-05-15T11:20:00",
      updatedAt: "2023-07-10T14:50:00",
    },
    {
      id: "8",
      name: "Customer Appreciation Day",
      description: "Event to show appreciation to key customers",
      responsibleId: "8",
      responsibleName: "Lisa Anderson",
      goal: "Strengthen relationships with key customers",
      department: "Marketing",
      periodId: "1",
      periodName: "Q4 2023",
      startDate: "2023-12-08T11:00:00",
      endDate: "2023-12-08T15:00:00",
      funds: 18000,
      usedFunds: 0,
      remainingFunds: 18000,
      status: "DRAFT",
      workProgramId: "2",
      workProgramName: "Market Expansion",
      createdAt: "2023-10-01T13:25:00",
      updatedAt: "2023-10-01T13:25:00",
    },
  ]);

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter events based on search term and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    const matchesDepartment =
      departmentFilter === "all" || event.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Toggle event selection
  const toggleEventSelection = (id: string) => {
    if (selectedEvents.includes(id)) {
      setSelectedEvents(selectedEvents.filter((eventId) => eventId !== id));
    } else {
      setSelectedEvents([...selectedEvents, id]);
    }
  };

  // Select all events on current page
  const toggleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map((event) => event.id));
    }
  };

  // Navigate to add event page
  const handleAddEvent = () => {
    router.push("/dashboard/events/add");
  };

  // Navigate to edit event page
  const handleEditEvent = (id: string) => {
    router.push(`/dashboard/events/edit/${id}`);
  };

  // View event details
  const handleViewEvent = (id: string) => {
    router.push(`/dashboard/events/${id}`);
  };

  // Delete event(s)
  const handleDelete = (event?: Event) => {
    if (event) {
      setCurrentEvent(event);
    }
    setShowDeleteModal(true);
  };

  // Execute deletion
  const confirmDelete = () => {
    if (currentEvent) {
      // Delete single event
      setEvents(events.filter((event) => event.id !== currentEvent.id));
    } else if (selectedEvents.length > 0) {
      // Delete multiple events
      setEvents(events.filter((event) => !selectedEvents.includes(event.id)));
      setSelectedEvents([]);
    }
    setShowDeleteModal(false);
    setCurrentEvent(null);
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-gray-100 text-gray-800";
      case "ONGOING":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get department badge class
  const getDepartmentClass = (department: string) => {
    switch (department) {
      case "IT":
        return "bg-purple-100 text-purple-800";
      case "Marketing":
        return "bg-pink-100 text-pink-800";
      case "Finance":
        return "bg-green-100 text-green-800";
      case "HR":
        return "bg-blue-100 text-blue-800";
      case "Operations":
        return "bg-yellow-100 text-yellow-800";
      case "Executive":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Calculate fund utilization percentage
  const getUtilizationPercentage = (used: number, total: number) => {
    if (total === 0) return 0;
    return (used / total) * 100;
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all organizational events and their budgets
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
          onClick={handleAddEvent}
        >
          <FiPlus className="mr-2" />
          Create New Event
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiCalendar className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {events.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Total Budget</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatCurrency(
              events.reduce((sum, event) => sum + event.funds, 0)
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Used Funds</h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiPieChart className="text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {formatCurrency(
              events.reduce((sum, event) => sum + event.usedFunds, 0)
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Ongoing Events
            </h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiClock className="text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {events.filter((e) => e.status === "ONGOING").length}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events by name or description..."
              className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter className="mr-2 text-gray-500" />
            Filters
            <FiChevronDown
              className={`ml-2 transition-transform ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="DRAFT">Draft</option>
                <option value="ONGOING">Ongoing</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                <option value="all">All Departments</option>
                <option value="IT">IT</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
                <option value="Operations">Operations</option>
                <option value="Executive">Executive</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                  selectedEvents.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
                onClick={() => handleDelete()}
                disabled={selectedEvents.length === 0}
              >
                <FiTrash2 className="mr-2" />
                Delete Selected ({selectedEvents.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  <input
                    type="checkbox"
                    checked={
                      filteredEvents.length > 0 &&
                      selectedEvents.length === filteredEvents.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Dates
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Budget
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedEvents.includes(event.id)}
                      onChange={() => toggleEventSelection(event.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      {event.thumbnail ? (
                        <img
                          src={event.thumbnail}
                          alt={event.name}
                          className="flex-shrink-0 h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                          <FiCalendar className="text-gray-400" />
                        </div>
                      )}
                      <div className="ml-4">
                        <div
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => handleViewEvent(event.id)}
                        >
                          {event.name}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {event.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                          <FiUser className="mr-1" size={12} />
                          {event.responsibleName}
                          {event.workProgramName && (
                            <>
                              <FiBookOpen className="ml-2 mr-1" size={12} />
                              {event.workProgramName}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getDepartmentClass(
                        event.department
                      )}`}
                    >
                      {event.department}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div>{formatDate(event.startDate)}</div>
                    <div className="text-gray-400">
                      to {formatDate(event.endDate)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(event.funds)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${getUtilizationPercentage(
                            event.usedFunds,
                            event.funds
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Used: {formatCurrency(event.usedFunds)} / Remaining:{" "}
                      {formatCurrency(event.remainingFunds)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                        event.status
                      )}`}
                    >
                      {event.status.charAt(0) +
                        event.status.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => handleEditEvent(event.id)}
                        title="Edit event"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(event)}
                        title="Delete event"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      {event.status === "DRAFT" && (
                        <button
                          className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          onClick={() => {
                            setEvents(
                              events.map((e) =>
                                e.id === event.id
                                  ? { ...e, status: "ONGOING" }
                                  : e
                              )
                            );
                          }}
                          title="Start event"
                        >
                          <FiCheckCircle size={16} />
                        </button>
                      )}
                      {event.status === "ONGOING" && (
                        <button
                          className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                          onClick={() => {
                            setEvents(
                              events.map((e) =>
                                e.id === event.id
                                  ? { ...e, status: "COMPLETED" }
                                  : e
                              )
                            );
                          }}
                          title="Complete event"
                        >
                          <FiArchive size={16} />
                        </button>
                      )}
                      {(event.status === "DRAFT" ||
                        event.status === "ONGOING") && (
                        <button
                          className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                          onClick={() => {
                            setEvents(
                              events.map((e) =>
                                e.id === event.id
                                  ? { ...e, status: "CANCELLED" }
                                  : e
                              )
                            );
                          }}
                          title="Cancel event"
                        >
                          <FiXCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FiCalendar size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No events found</p>
            <p className="text-gray-400 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Table Footer */}
        {filteredEvents.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredEvents.length}</span> of{" "}
              <span className="font-medium">{events.length}</span> events
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Confirm Deletion
                </h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCurrentEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {currentEvent
                  ? `Are you sure you want to delete "${currentEvent.name}"? This action cannot be undone.`
                  : `Are you sure you want to delete ${selectedEvents.length} selected events? This action cannot be undone.`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentEvent(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
