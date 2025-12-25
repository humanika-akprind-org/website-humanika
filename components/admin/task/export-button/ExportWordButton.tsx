import { File } from "lucide-react";
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
  AlignmentType,
} from "docx";
import type { DepartmentTask } from "@/types/task";
import { convertHtmlToDocxElements } from "@/lib/htmlUtils";

interface TextRunOptions {
  text?: string;
  bold?: boolean;
  italics?: boolean;
  underline?: object;
  strike?: boolean;
  color?: string;
  highlight?:
    | "black"
    | "blue"
    | "cyan"
    | "darkBlue"
    | "darkCyan"
    | "darkGray"
    | "darkGreen"
    | "darkMagenta"
    | "darkRed"
    | "darkYellow"
    | "green"
    | "lightGray"
    | "magenta"
    | "none"
    | "red"
    | "white"
    | "yellow";
  size?: number;
}

interface DocxParagraphElement {
  type: "paragraph";
  children: TextRunOptions[];
  alignment?: string;
  indent?: { left: number };
}

interface DocxTableElement {
  type: "table";
  rows: {
    children: {
      children: TextRunOptions[];
    }[];
  }[];
}

type DocxElement = DocxParagraphElement | DocxTableElement;

interface ExportWordButtonProps {
  tasks: DepartmentTask[];
  convertHtmlToText: (html: string) => string;
}

export default function ExportWordButton({
  tasks,
  convertHtmlToText: _convertHtmlToText,
}: ExportWordButtonProps) {
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
      ...tasks.map(
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

  return (
    <button
      onClick={exportToWord}
      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <File className="h-4 w-4 mr-2" />
      Export Word
    </button>
  );
}

export function exportSingleTaskToWord(task: DepartmentTask) {
  const elements: DocxElement[] = convertHtmlToDocxElements(task.note);
  const noteElements = elements.map((el) => {
    if (el.type === "paragraph") {
      return new Paragraph({
        children: el.children.map((run) => new TextRun(run)),
        alignment:
          el.alignment === "center"
            ? AlignmentType.CENTER
            : el.alignment === "right"
            ? AlignmentType.RIGHT
            : el.alignment === "both"
            ? AlignmentType.JUSTIFIED
            : AlignmentType.LEFT,
        indent: el.indent,
      });
    } else if (el.type === "table") {
      const rows = el.rows.map(
        (row) =>
          new TableRow({
            children: row.children.map(
              (cell) =>
                new TableCell({
                  children: cell.children.map(
                    (run) =>
                      new Paragraph({
                        children: [new TextRun(run)],
                      })
                  ),
                })
            ),
          })
      );
      return new Table({
        rows,
        width: { size: 100, type: WidthType.PERCENTAGE },
      });
    }
    return new Paragraph({ text: "" });
  });

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
          ...noteElements,
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
}
