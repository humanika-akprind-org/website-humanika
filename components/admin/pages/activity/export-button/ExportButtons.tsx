"use client";

import { FileText, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ActivityLog } from "@/types/activity-log";

interface ExportButtonsProps {
  activities: ActivityLog[];
}

export default function ExportButtons({ activities }: ExportButtonsProps) {
  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF("landscape");

    // Title
    doc.setFontSize(18);
    doc.text("Activity Log Report", 14, 20);

    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Table data
    const tableData = activities.map((activity) => [
      activity.user?.name || "Unknown User",
      activity.activityType,
      activity.entityType,
      activity.description,
      activity.ipAddress || "N/A",
      new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(new Date(activity.createdAt)),
    ]);

    // Add table
    autoTable(doc, {
      head: [
        [
          "User",
          "Activity Type",
          "Entity Type",
          "Description",
          "IP Address",
          "Date & Time",
        ],
      ],
      body: tableData,
      startY: 40,
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

    // Save the PDF
    const filename = "activity-log-report.pdf";
    doc.save(filename);
  };

  // Export to Excel
  const exportToExcel = () => {
    // Create worksheet data with title
    const wsData = [
      ["Activity Log Report"],
      [""],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [
        "User",
        "Activity Type",
        "Entity Type",
        "Description",
        "IP Address",
        "Date & Time",
      ],
      ...activities.map((activity) => [
        activity.user?.name || "Unknown User",
        activity.activityType,
        activity.entityType,
        activity.description,
        activity.ipAddress || "N/A",
        new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(activity.createdAt)),
      ]),
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Define styles
    const titleStyle = {
      font: { bold: true, sz: 16 },
      alignment: { horizontal: "center" },
    };

    const headerStyle = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "2980B9" } },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
      alignment: { horizontal: "center", vertical: "center" },
    };

    const cellStyle = {
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
      alignment: { vertical: "center" },
    };

    const alternateRowStyle = {
      ...cellStyle,
      fill: { fgColor: { rgb: "F5F5F5" } },
    };

    // Apply title style (row 0, column 0)
    ws["A1"].s = titleStyle;

    // Apply styles to header row (row 3 - the actual header row)
    const headerRow = 3;
    for (let col = 0; col < 6; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
      if (ws[cellAddress]) {
        ws[cellAddress].s = headerStyle;
      }
    }

    // Apply styles to data rows (starting from row 4)
    const dataStartRow = 4;
    for (let row = dataStartRow; row < wsData.length; row++) {
      const isAlternate = (row - dataStartRow) % 2 === 0; // Even rows get alternate style
      for (let col = 0; col < 6; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (ws[cellAddress]) {
          ws[cellAddress].s = isAlternate ? alternateRowStyle : cellStyle;
        }
      }
    }

    // Merge title cells (A1:F1)
    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 5 } });

    // Define table range
    const tableStartRow = 3; // Header row (0-based)
    const tableEndRow = 3 + activities.length; // Last data row (0-based)
    ws["!table"] = {
      ref: `A${tableStartRow + 1}:F${tableEndRow + 1}`,
      headers: [
        "User",
        "Activity Type",
        "Entity Type",
        "Description",
        "IP Address",
        "Date & Time",
      ],
    };

    // Set column widths
    ws["!cols"] = [
      { wch: 20 }, // User
      { wch: 15 }, // Activity Type
      { wch: 15 }, // Entity Type
      { wch: 40 }, // Description
      { wch: 15 }, // IP Address
      { wch: 20 }, // Date & Time
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Activity Log");

    // Generate filename
    const filename = "activity-log-report.xlsx";

    // Save file
    XLSX.writeFile(wb, filename);
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={exportToPDF}
        disabled={activities.length === 0}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </button>
      <button
        onClick={exportToExcel}
        disabled={activities.length === 0}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export Excel
      </button>
    </div>
  );
}
