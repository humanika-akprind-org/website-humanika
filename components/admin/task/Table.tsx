import { useState, useRef } from "react";
import { FiCheckCircle, FiEye, FiTrash, FiEdit } from "react-icons/fi";
import { FileText, File } from "lucide-react";
import type { DepartmentTask } from "@/types/task";
import SortIcon from "../ui/SortIcon";
import StatusChip from "../ui/chip/Status";
import Checkbox from "../ui/checkbox/Checkbox";
import Pagination from "../ui/pagination/Pagination";
import EmptyState from "../ui/EmptyState";
import AddButton from "../ui/button/AddButton";
import DropdownMenuItem from "../ui/dropdown/DropdownMenuItem";
import DropdownMenu from "../ui/dropdown/DropdownMenu";
import DepartmentChip from "../ui/chip/Department";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  WidthType,
  TextRun,
  ShadingType,
} from "docx";

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

  // Function to convert HTML to plain text with formatting
  const convertHtmlToText = (html: string): string => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;

    // Handle common HTML elements
    const elements = tmp.querySelectorAll(
      "p, br, div, li, h1, h2, h3, h4, h5, h6, strong, b, em, i, u"
    );
    elements.forEach((el) => {
      if (el.tagName === "BR") {
        el.textContent = "\n";
      } else if (el.tagName === "P" || el.tagName === "DIV") {
        el.textContent = el.textContent + "\n\n";
      } else if (el.tagName === "LI") {
        el.textContent = "• " + el.textContent + "\n";
      } else if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(el.tagName)) {
        el.textContent = el.textContent?.toUpperCase() + "\n\n";
      } else if (el.tagName === "STRONG" || el.tagName === "B") {
        el.textContent = el.textContent; // Keep as is for now
      } else if (el.tagName === "EM" || el.tagName === "I") {
        el.textContent = el.textContent; // Keep as is for now
      }
    });

    return tmp.textContent || tmp.innerText || "";
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Task Report", 20, 10);

    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 20);

    const tableData = sortedTasks.map((task) => [
      task.title,
      task.subtitle || "",
      task.department,
      task.user?.name || "Unassigned",
      task.status,
    ]);

    autoTable(doc, {
      head: [["Task", "Subtitle", "Department", "Assigned User", "Status"]],
      body: tableData,
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("task-report.pdf");
  };

  // Export to Word
  const exportToWord = () => {
    const tableRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Task", bold: true })],
              }),
            ],
            shading: { type: ShadingType.SOLID, color: "2980B9" },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Subtitle", bold: true })],
              }),
            ],
            shading: { type: ShadingType.SOLID, color: "2980B9" },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Department", bold: true })],
              }),
            ],
            shading: { type: ShadingType.SOLID, color: "2980B9" },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Assigned User", bold: true })],
              }),
            ],
            shading: { type: ShadingType.SOLID, color: "2980B9" },
          }),
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: "Status", bold: true })],
              }),
            ],
            shading: { type: ShadingType.SOLID, color: "2980B9" },
          }),
        ],
      }),
      ...sortedTasks.map(
        (task, index) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(task.title)],
                shading:
                  index % 2 === 1
                    ? { type: ShadingType.SOLID, color: "F5F5F5" }
                    : undefined,
              }),
              new TableCell({
                children: [new Paragraph(task.subtitle || "")],
                shading:
                  index % 2 === 1
                    ? { type: ShadingType.SOLID, color: "F5F5F5" }
                    : undefined,
              }),
              new TableCell({
                children: [new Paragraph(task.department)],
                shading:
                  index % 2 === 1
                    ? { type: ShadingType.SOLID, color: "F5F5F5" }
                    : undefined,
              }),
              new TableCell({
                children: [new Paragraph(task.user?.name || "Unassigned")],
                shading:
                  index % 2 === 1
                    ? { type: ShadingType.SOLID, color: "F5F5F5" }
                    : undefined,
              }),
              new TableCell({
                children: [new Paragraph(task.status)],
                shading:
                  index % 2 === 1
                    ? { type: ShadingType.SOLID, color: "F5F5F5" }
                    : undefined,
              }),
            ],
          })
      ),
    ];

    const table = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows,
    });

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Task Report",
              heading: "Heading1",
            }),
            new Paragraph({
              text: `Generated on: ${new Date().toLocaleDateString()}`,
            }),
            new Paragraph(""),
            table,
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "task-report.docx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  // Export single task to PDF
  const exportSingleTaskToPDF = (task: DepartmentTask) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Task Details", 20, 15);

    // Add task information
    doc.setFontSize(12);
    let yPosition = 30;

    doc.setFontSize(14);
    doc.text("Title:", 20, yPosition);
    doc.setFontSize(12);
    doc.text(task.title, 50, yPosition);
    yPosition += 10;

    if (task.subtitle) {
      doc.setFontSize(14);
      doc.text("Subtitle:", 20, yPosition);
      doc.setFontSize(12);
      doc.text(task.subtitle, 50, yPosition);
      yPosition += 10;
    }

    doc.setFontSize(14);
    doc.text("Department:", 20, yPosition);
    doc.setFontSize(12);
    doc.text(task.department, 60, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.text("Assigned User:", 20, yPosition);
    doc.setFontSize(12);
    doc.text(task.user?.name || "Unassigned", 75, yPosition);
    yPosition += 10;

    if (task.workProgram) {
      doc.setFontSize(14);
      doc.text("Work Program:", 20, yPosition);
      doc.setFontSize(12);
      doc.text(task.workProgram.name, 70, yPosition);
      yPosition += 10;
    }

    doc.setFontSize(14);
    doc.text("Status:", 20, yPosition);
    doc.setFontSize(12);
    doc.text(task.status, 45, yPosition);
    yPosition += 15;

    // Add note section
    doc.setFontSize(14);
    doc.text("Note:", 20, yPosition);
    yPosition += 8;

    doc.setFontSize(12);
    const noteLines = doc.splitTextToSize(convertHtmlToText(task.note), 170);
    doc.text(noteLines, 20, yPosition);

    // Add generation date at bottom
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      20,
      pageHeight - 15
    );

    doc.save(`task-${task.id}.pdf`);
  };

  // Export single task to Word
  const exportSingleTaskToWord = (task: DepartmentTask) => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Task Details",
              heading: "Heading1",
            }),
            new Paragraph(""),
            new Paragraph({
              text: `Title: ${task.title}`,
            }),
            ...(task.subtitle
              ? [new Paragraph({ text: `Subtitle: ${task.subtitle}` })]
              : []),
            new Paragraph({
              text: `Department: ${task.department}`,
            }),
            new Paragraph({
              text: `Assigned User: ${task.user?.name || "Unassigned"}`,
            }),
            ...(task.workProgram
              ? [
                  new Paragraph({
                    text: `Work Program: ${task.workProgram.name}`,
                  }),
                ]
              : []),
            new Paragraph({
              text: `Status: ${task.status}`,
            }),
            new Paragraph(""),
            new Paragraph({
              text: "Note:",
              heading: "Heading2",
            }),
            ...convertHtmlToText(task.note)
              .split("\n\n")
              .filter((p) => p.trim())
              .map((p) => new Paragraph({ text: p })),
            new Paragraph(""),
            new Paragraph({
              text: `Generated on: ${new Date().toLocaleDateString()}`,
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `task-${task.id}.docx`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-visible border border-gray-100">
      {/* Export Buttons */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-end gap-3">
          <button
            onClick={exportToPDF}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF
          </button>
          <button
            onClick={exportToWord}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <File className="h-4 w-4 mr-2" />
            Export Word
          </button>
        </div>
      </div>
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
                      color="green"
                    >
                      <FileText className="mr-2" size={14} />
                      Export PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => exportSingleTaskToWord(task)}
                      color="orange"
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
          icon={<FiCheckCircle size={48} className="mx-auto" />}
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
