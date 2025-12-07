import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DepartmentTask } from "@/types/task";

interface ExportPDFButtonProps {
  tasks: DepartmentTask[];
  convertHtmlToText: (html: string) => string;
}

export default function ExportPDFButton({
  tasks,
  convertHtmlToText: _convertHtmlToText,
}: ExportPDFButtonProps) {
  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Task Report", 20, 10);

    // Add generation date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 20);

    const tableData = tasks.map((task) => [
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

  return (
    <button
      onClick={handleExportPDF}
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <FileText className="h-4 w-4 mr-2" />
      Export PDF
    </button>
  );
}

export function exportSingleTaskToPDF(
  task: DepartmentTask,
  convertHtmlToText: (html: string) => string
) {
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
}
