"use client";

import React, { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";


// Dynamically import CKEditor to avoid SSR issues
const CKEditor = dynamic(
  () =>
    import("@ckeditor/ckeditor5-react").then((mod) => ({
      default: mod.CKEditor,
    })),
  { ssr: false }
);
// Dynamically load DecoupledEditor on client side

interface TextEditorProps {
  value: string;
  onChange: (data: string) => void;
  disabled?: boolean;
  height?: string;
}

const editorConfig = {
  toolbar: [
    "heading",
    "|",
    "bold",
    "italic",
    "underline",
    "strikethrough",
    "|",
    "fontColor",
    "fontBackgroundColor",
    "highlight",
    "|",
    "alignment:left",
    "alignment:center",
    "alignment:right",
    "alignment:justify",
    "|",
    "numberedList",
    "bulletedList",
    "|",
    "indent",
    "outdent",
    "|",
    "link",
    "blockQuote",
    "imageInsert",
    "insertTable",
    "mediaEmbed",
    "horizontalLine",
    "specialCharacters",
    "codeBlock",
    "|",
    "removeFormat",
    "pastePlainText",
    "|",
    "undo",
    "redo",
  ],
  heading: {
    options: [
      {
        model: "paragraph" as const,
        title: "Paragraph",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading1" as const,
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2" as const,
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3" as const,
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4" as const,
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5" as const,
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6" as const,
        view: "h6",
        title: "Heading 6",
        class: "ck-heading_heading6",
      },
    ],
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableCellProperties",
      "tableProperties",
    ],
  },
  image: {
    toolbar: [
      "imageStyle:full",
      "imageStyle:side",
      "|",
      "imageTextAlternative",
    ],
  },
  mediaEmbed: {
    previewsInData: true,
  },
};

export default function TextEditor({
  value,
  onChange,
  disabled = false,
}: TextEditorProps) {
const toolbarContainerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [DecoupledEditor, setDecoupledEditor] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import DecoupledEditor on client side
    import("@ckeditor/ckeditor5-build-decoupled-document").then((mod) => {
      setDecoupledEditor(mod.default);
    });
    const toolbarContainer = toolbarContainerRef.current;
    return () => {
      if (toolbarContainer) {
        toolbarContainer.innerHTML = "";
      }
    };
  }, []);

  if (!isClient) {
    return (
      <div className="document-editor border border-gray-300 rounded-md overflow-hidden">
        <div className="document-editor__toolbar bg-gray-50 border-b border-gray-300 p-2" />
        <div className="document-editor__editable-container p-4">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className="w-full h-48 p-2 border-0 resize-none focus:outline-none"
            placeholder="Loading editor..."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="document-editor border border-gray-300 rounded-md overflow-hidden">
      <style>
        {`
          .ck-content h1 { font-size: 2em; margin: 0.67em 0; }
          .ck-content h2 { font-size: 1.5em; margin: 0.83em 0; }
          .ck-content h3 { font-size: 1.17em; margin: 1em 0; }
          .ck-content h4 { font-size: 1em; margin: 1.33em 0; }
          .ck-content h5 { font-size: 0.83em; margin: 1.67em 0; }
          .ck-content h6 { font-size: 0.67em; margin: 2.33em 0; }
          .document-editor__editable { height: 200px; }
        `}
      </style>
      <div
        ref={toolbarContainerRef}
        className="document-editor__toolbar bg-gray-50 border-b border-gray-300 p-2"
      />
      <div className="document-editor__editable-container p-4">
        {DecoupledEditor && (
          <CKEditor
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            editor={DecoupledEditor}
            data={value}
            onReady={(editor) => {
              // Bersihkan toolbar container terlebih dahulu
              if (toolbarContainerRef.current) {
                toolbarContainerRef.current.innerHTML = "";
              }

              // Attach toolbar hanya jika belum ada
              if (toolbarContainerRef.current && editor.ui.view.toolbar) {
                toolbarContainerRef.current.appendChild(
                  editor.ui.view.toolbar.element!
                );
              }

              // Set the editor's editable element class
              const editable = editor.ui.getEditableElement();
              if (editable) {
                editable.classList.add("document-editor__editable");
              }
            }}
            onChange={(_, editor) => {
              const data = editor.getData();
              onChange(data);
            }}
            disabled={disabled}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            config={editorConfig as any}
          />
        )}
      </div>
    </div>
  );
}
