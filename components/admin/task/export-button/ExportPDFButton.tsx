import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { DepartmentTask } from "@/types/task";
import {
  convertHtmlToPdfElements,
  type PdfElement,
  type PdfTextRun,
} from "@/lib/htmlUtils";

interface ExportPDFButtonProps {
  tasks: DepartmentTask[];
}

export default function ExportPDFButton({ tasks }: ExportPDFButtonProps) {
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

    // Add task notes after the table
    let yPosition =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 10;

    tasks.forEach((task, index) => {
      if (task.note && task.note.trim()) {
        // Add task title
        doc.setFontSize(14);
        doc.setFont(undefined, "bold");
        doc.text(`Task ${index + 1}: ${task.title}`, 20, yPosition);
        yPosition += 10;

        // Render HTML elements for the note
        const elements = convertHtmlToPdfElements(task.note);
        yPosition = renderPdfElements(doc, elements, yPosition);

        yPosition += 10; // Space between tasks
      }
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

// Helper function to render a paragraph with rich text
function renderParagraph(
  doc: jsPDF,
  element: PdfElement & { type: "paragraph" },
  startY: number,
  margin: number,
  maxWidth: number
): number {
  const lineHeight = 6;
  const pageWidth = doc.internal.pageSize.width;
  const alignment = element.alignment || "left";
  const indent = element.indent || 0;

  // First pass: split into lines
  const lines: Array<Array<{ word: string; run: PdfTextRun }>> = [];
  let currentLine: Array<{ word: string; run: PdfTextRun }> = [];
  let currentWidth = 0;

  element.children.forEach((run) => {
    // Set font for width calculation
    let fontStyle = "normal";
    if (run.bold && run.italics) fontStyle = "bolditalic";
    else if (run.bold) fontStyle = "bold";
    else if (run.italics) fontStyle = "italic";
    doc.setFont(undefined, fontStyle);
    doc.setFontSize(run.size || 12);

    const words = run.text.split(/\s+/);
    words.forEach((word) => {
      if (!word) return;
      const wordWidth = doc.getTextWidth(word + " ");
      if (currentWidth + wordWidth > maxWidth) {
        // New line
        if (currentLine.length > 0) {
          lines.push(currentLine);
          currentLine = [];
          currentWidth = 0;
        }
      }
      currentLine.push({ word, run });
      currentWidth += wordWidth;
    });
  });
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  // Second pass: render lines with alignment
  let yPosition = startY;
  lines.forEach((line, _lineIndex) => {
    // Calculate total width of the line
    let totalWidth = 0;
    line.forEach((item) => {
      doc.setFont(
        undefined,
        item.run.bold && item.run.italics
          ? "bolditalic"
          : item.run.bold
          ? "bold"
          : item.run.italics
          ? "italic"
          : "normal"
      );
      doc.setFontSize(item.run.size || 12);
      totalWidth += doc.getTextWidth(item.word + " ");
    });

    // Calculate startX based on alignment
    let startX: number;
    if (alignment === "center") {
      startX = (pageWidth - totalWidth) / 2;
    } else if (alignment === "right") {
      startX = pageWidth - margin - totalWidth;
    } else {
      // left or justify (treat as left for now)
      startX = margin + indent;
    }

    // Render each word in the line
    let currentX = startX;
    line.forEach((item) => {
      const run = item.run;
      const word = item.word;

      // Set font style
      let fontStyle = "normal";
      if (run.bold && run.italics) fontStyle = "bolditalic";
      else if (run.bold) fontStyle = "bold";
      else if (run.italics) fontStyle = "italic";
      doc.setFont(undefined, fontStyle);

      // Set font size
      const fontSize = run.size || 12;
      doc.setFontSize(fontSize);

      // Set text color
      if (run.color) {
        const r = parseInt(run.color.slice(1, 3), 16);
        const g = parseInt(run.color.slice(3, 5), 16);
        const b = parseInt(run.color.slice(5, 7), 16);
        doc.setTextColor(r, g, b);
      } else {
        doc.setTextColor(0, 0, 0);
      }

      // Handle highlight (background)
      if (run.highlight) {
        const textWidth = doc.getTextWidth(word);
        const r = parseInt(run.highlight.slice(1, 3), 16);
        const g = parseInt(run.highlight.slice(3, 5), 16);
        const b = parseInt(run.highlight.slice(5, 7), 16);
        doc.setFillColor(r, g, b);
        doc.rect(
          currentX,
          yPosition - fontSize * 0.2,
          textWidth,
          fontSize * 0.8,
          "F"
        );
      }

      // Render text
      doc.text(word, currentX, yPosition);
      const textWidth = doc.getTextWidth(word);

      // Handle underline
      if (run.underline) {
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0);
        doc.line(currentX, yPosition + 1, currentX + textWidth, yPosition + 1);
      }

      // Handle strike
      if (run.strike) {
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0);
        const strikeY = yPosition - fontSize / 4;
        doc.line(currentX, strikeY, currentX + textWidth, strikeY);
      }

      currentX += doc.getTextWidth(word + " ");
    });

    yPosition += lineHeight;
  });

  return yPosition + 4; // Extra space after paragraph
}

// Helper function to render PDF elements
function renderPdfElements(
  doc: jsPDF,
  elements: PdfElement[],
  startY: number
): number {
  let yPosition = startY;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;

  elements.forEach((element) => {
    if (element.type === "paragraph") {
      yPosition = renderParagraph(doc, element, yPosition, margin, maxWidth);
    } else if (element.type === "table") {
      const { rows } = element;
      const tableData = rows.map((row) =>
        row.children.map((cell) =>
          cell.children.map((run: PdfTextRun) => run.text).join("")
        )
      );

      autoTable(doc, {
        head: [tableData[0]],
        body: tableData.slice(1),
        startY: yPosition,
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
      });

      yPosition =
        (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 10;
    } else if (element.type === "list") {
      const { items, ordered } = element;
      items.forEach((item: PdfTextRun[], index: number) => {
        const bullet = ordered ? `${index + 1}. ` : "• ";
        const text = item.map((run: PdfTextRun) => run.text).join("");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, "normal");
        doc.text(bullet + text, margin, yPosition);
        yPosition += 8;
      });
      yPosition += 5;
    } else if (element.type === "link") {
      const { text, url: _url } = element;
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 255);
      doc.setFontStyle("normal");
      doc.text(text, margin, yPosition);
      yPosition += 8;
    }
  });

  return yPosition;
}

export function exportSingleTaskToPDF(task: DepartmentTask) {
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

  // Render HTML elements
  const elements = convertHtmlToPdfElements(task.note);
  yPosition = renderPdfElements(doc, elements, yPosition);

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
