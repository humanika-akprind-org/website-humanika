import { useState } from "react";
import Link from "next/link";
import { FiEdit, FiTrash2, FiEye, FiCalendar } from "react-icons/fi";
import type { Event } from "@/types/event";
import type { Status } from "@/types/enums";
import { Status as StatusEnum } from "@/types/enums";
import Image from "next/image";

interface EventTableProps {
  events: Event[];
  onDelete: (id: string) => void;
}

export default function EventTable({ events, onDelete }: EventTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case StatusEnum.DRAFT:
        return "bg-gray-100 text-gray-800";
      case StatusEnum.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case StatusEnum.APPROVED:
        return "bg-green-100 text-green-800";
      case StatusEnum.REJECTED:
        return "bg-red-100 text-red-800";
      case StatusEnum.REVISION:
        return "bg-orange-100 text-orange-800";
      case StatusEnum.ARCHIVED:
        return "bg-gray-100 text-gray-600";
      case StatusEnum.ONGOING:
        return "bg-blue-100 text-blue-800";
      case StatusEnum.COMPLETED:
        return "bg-green-100 text-green-800";
      case StatusEnum.CANCELLED:
        return "bg-red-100 text-red-800";
      case StatusEnum.POSTPONED:
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      onDelete(id);
    }
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
        <p className="text-gray-500">Get started by creating your first event.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Responsible
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {event.thumbnail && (
                      <Image
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                        src={event.thumbnail}
                        alt={event.name}
                      />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {event.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">
                        {event.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{event.department}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatDate(event.startDate)}
                  </div>
                  <div className="text-sm text-gray-500">
                    to {formatDate(event.endDate)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {formatCurrency(event.funds)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Used: {formatCurrency(event.usedFunds)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      event.status
                    )}`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {event.responsible.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {event.responsible.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/admin/programs/events/${event.id}`}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="View Details"
                    >
                      <FiEye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/programs/events/edit/${event.id}`}
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                      title="Edit"
                    >
                      <FiEdit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
