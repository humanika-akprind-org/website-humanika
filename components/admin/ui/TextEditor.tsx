import React, { useRef, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

interface TextEditorProps {
  value: string;
  onChange: (data: string) => void;
  disabled?: boolean;
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
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
      {
        model: "heading4",
        view: "h4",
        title: "Heading 4",
        class: "ck-heading_heading4",
      },
      {
        model: "heading5",
        view: "h5",
        title: "Heading 5",
        class: "ck-heading_heading5",
      },
      {
        model: "heading6",
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

  useEffect(() => () => {
    if (toolbarContainerRef.current) {
      toolbarContainerRef.current.innerHTML = "";
    }
  }, []);

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
        <CKEditor
          editor={DecoupledEditor as any}
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
          config={editorConfig as any}
        />
      </div>
    </div>
  );
}
