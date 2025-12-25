"use client";

import { useState } from "react";
import { FileText, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { WorkProgram } from "@/types/work";
import SelectInput from "@/components/admin/ui/input/SelectInput";
import { X } from "lucide-react";

interface ExportButtonsProps {
  workPrograms: WorkProgram[];
  periods: string[];
}

export default function ExportButtons({
  workPrograms,
  periods,
}: ExportButtonsProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("All");
  const [exportType, setExportType] = useState<"pdf" | "excel" | null>(null);

  // Filter work programs based on selected period
  const getFilteredPrograms = () => {
    if (selectedPeriod === "All") {
      return workPrograms;
    }
    return workPrograms.filter(
      (program) => program.period?.name === selectedPeriod
    );
  };

  // Export to PDF
  const exportToPDF = () => {
    const filteredPrograms = getFilteredPrograms();
    const doc = new jsPDF("landscape");

    // Title
    doc.setFontSize(18);
    doc.text("Work Program Report", 14, 20);

    // Period info
    if (selectedPeriod !== "All") {
      doc.setFontSize(12);
      doc.text(`Period: ${selectedPeriod}`, 14, 30);
    }

    // Date
    doc.setFontSize(10);
    doc.text(
      `Generated on: ${new Date().toLocaleDateString()}`,
      14,
      selectedPeriod !== "All" ? 35 : 30
    );

    // Table data
    const tableData = filteredPrograms.map((program) => [
      program.name,
      program.department,
      program.status,
      program.schedule,
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(program.funds),
      program.responsible?.name || "Unassigned",
      program.period?.name || "No period",
    ]);

    // Add table
    autoTable(doc, {
      head: [
        [
          "Program Name",
          "Department",
          "Status",
          "Schedule",
          "Funds",
          "Responsible",
          "Period",
        ],
      ],
      body: tableData,
      startY: selectedPeriod !== "All" ? 45 : 40,
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
    const filename =
      selectedPeriod === "All"
        ? "work-programs-all.pdf"
        : `work-programs-${selectedPeriod}.pdf`;
    doc.save(filename);
  };

  // Export to Excel
  const exportToExcel = () => {
    const filteredPrograms = getFilteredPrograms();
    // Create worksheet data with title
    const wsData = [
      ["Work Program Report"],
      selectedPeriod !== "All" ? [`Period: ${selectedPeriod}`] : [""],
      [`Generated on: ${new Date().toLocaleDateString()}`],
      [
        "Program Name",
        "Department",
        "Status",
        "Schedule",
        "Funds",
        "Responsible",
        "Period",
      ],
      ...filteredPrograms.map((program) => [
        program.name,
        program.department,
        program.status,
        program.schedule,
        program.funds,
        program.responsible?.name || "Unassigned",
        program.period?.name || "No period",
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
    for (let col = 0; col < 7; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: headerRow, c: col });
      if (ws[cellAddress]) {
        ws[cellAddress].s = headerStyle;
      }
    }

    // Apply styles to data rows (starting from row 4)
    const dataStartRow = 4;
    for (let row = dataStartRow; row < wsData.length; row++) {
      const isAlternate = (row - dataStartRow) % 2 === 0; // Even rows get alternate style
      for (let col = 0; col < 7; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
        if (ws[cellAddress]) {
          ws[cellAddress].s = isAlternate ? alternateRowStyle : cellStyle;
          // Format funds column as currency
          if (col === 4) {
            ws[cellAddress].z = '#,##0 "IDR"';
          }
        }
      }
    }

    // Merge title cells (A1:G1)
    if (!ws["!merges"]) ws["!merges"] = [];
    ws["!merges"].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } });

    // Define table range
    const tableStartRow = 3; // Header row (0-based)
    const tableEndRow = 3 + workPrograms.length; // Last data row (0-based)
    ws["!table"] = {
      ref: `A${tableStartRow + 1}:G${tableEndRow + 1}`,
      headers: [
        "Program Name",
        "Department",
        "Status",
        "Schedule",
        "Funds",
        "Responsible",
        "Period",
      ],
    };

    // Set column widths
    ws["!cols"] = [
      { wch: 25 }, // Program Name
      { wch: 15 }, // Department
      { wch: 12 }, // Status
      { wch: 15 }, // Schedule
      { wch: 15 }, // Funds (adjusted for currency)
      { wch: 15 }, // Responsible
      { wch: 12 }, // Period
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Work Programs");

    // Generate filename
    const filename = `work-programs-${selectedPeriod || "all"}.xlsx`;

    // Save file
    XLSX.writeFile(wb, filename);
  };

  const handleExportPDF = () => {
    setExportType("pdf");
    setShowModal(true);
  };

  const handleExportExcel = () => {
    setExportType("excel");
    setShowModal(true);
  };

  const handleConfirmExport = () => {
    if (exportType === "pdf") {
      exportToPDF();
    } else if (exportType === "excel") {
      exportToExcel();
    }
    setShowModal(false);
    setSelectedPeriod("All");
    setExportType(null);
  };

  const periodOptions = [
    { value: "All", label: "All Periods" },
    ...periods.map((period) => ({ value: period, label: period })),
  ];

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportPDF}
        disabled={workPrograms.length === 0}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileText className="h-4 w-4 mr-2" />
        Export PDF
      </button>
      <button
        onClick={handleExportExcel}
        disabled={workPrograms.length === 0}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FileSpreadsheet className="h-4 w-4 mr-2" />
        Export Excel
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Period for Export
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4">
              <SelectInput
                name="period"
                label="Period"
                value={selectedPeriod}
                onChange={setSelectedPeriod}
                options={periodOptions}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmExport}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Export {exportType === "pdf" ? "PDF" : "Excel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
