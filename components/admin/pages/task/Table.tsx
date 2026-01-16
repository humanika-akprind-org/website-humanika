import { useState, useRef } from "react";
import { FiEye, FiTrash, FiEdit } from "react-icons/fi";
import { ClipboardList, FileText, File } from "lucide-react";
import type { DepartmentTask } from "@/types/task";
import SortIcon from "../../ui/SortIcon";
import StatusChip from "../../ui/chip/Status";
import Checkbox from "../../ui/checkbox/Checkbox";
import Pagination from "../../ui/pagination/Pagination";
import EmptyState from "../../ui/EmptyState";
import AddButton from "../../ui/button/AddButton";
import DropdownMenuItem from "../../ui/dropdown/DropdownMenuItem";
import DropdownMenu from "../../ui/dropdown/DropdownMenu";
import DepartmentChip from "../../ui/chip/Department";
import { exportSingleTaskToPDF } from "./export-button/ExportPDFButton";
import { exportSingleTaskToWord } from "./export-button/ExportWordButton";

interface TaskTableProps {
  tasks: DepartmentTask[];
  selectedTasks: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onTaskSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewTask: (id: string) => void;
  onEditTask: (id: string) => void;
  onDeleteTask: (ids?: string[] | undefined) => void;
  onPageChange: (page: number) => void;
  onAddTask: () => void;
}

export default function TaskTable({
  tasks,
  selectedTasks,
  currentPage,
  totalPages,
  onTaskSelect,
  onSelectAll,
  onViewTask,
  onEditTask,
  onDeleteTask,
  onPageChange,
  onAddTask,
}: TaskTableProps) {
  const [sortField, setSortField] = useState("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // Sort tasks
  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "title":
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case "department":
        aValue = a.department.toLowerCase();
        bValue = b.department.toLowerCase();
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "user":
        aValue = a.user?.name?.toLowerCase() || "";
        bValue = b.user?.name?.toLowerCase() || "";
        break;

      default:
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-visible border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
              >
                <Checkbox
                  checked={
                    sortedTasks.length > 0 &&
                    selectedTasks.length === sortedTasks.length
                  }
                  onChange={onSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center">
                  Task
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="title"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("department")}
              >
                <div className="flex items-center">
                  Department
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="department"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("user")}
              >
                <div className="flex items-center">
                  Assigned User
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="user"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="status"
                    iconType="arrow"
                  />
                </div>
              </th>

              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTasks.map((task, index) => (
              <tr
                key={task.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedTasks.includes(task.id)}
                    onChange={() => onTaskSelect(task.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {task.title}
                  </div>
                  {task.subtitle && (
                    <div className="text-sm text-gray-500">{task.subtitle}</div>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <DepartmentChip department={task.department} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {task.user?.name || "Unassigned"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusChip status={task.status} />
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedTasks.length - 1}
                    hasMultipleItems={sortedTasks.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewTask(task.id)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditTask(task.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => exportSingleTaskToPDF(task)}
                      color="red"
                    >
                      <FileText className="mr-2" size={14} />
                      Export PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => exportSingleTaskToWord(task)}
                      color="blue"
                    >
                      <File className="mr-2" size={14} />
                      Export Word
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteTask([task.id])}
                      color="red"
                    >
                      <FiTrash className="mr-2" size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedTasks.length === 0 && (
        <EmptyState
          icon={<ClipboardList size={48} className="mx-auto" />}
          title="No tasks found"
          description="Try adjusting your search or filter criteria"
          actionButton={<AddButton onClick={onAddTask} text="Add Task" />}
        />
      )}

      {sortedTasks.length > 0 && (
        <Pagination
          usersLength={sortedTasks.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
