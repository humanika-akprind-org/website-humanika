import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface DescriptionEditorProps {
  value: string;
  onChange: (data: string) => void;
  disabled?: boolean;
}

export default function DescriptionEditor({
  value,
  onChange,
  disabled = false,
}: DescriptionEditorProps) {
  return (
    <CKEditor
      editor={ClassicEditor as any}
      data={value}
      onChange={(_, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
      disabled={disabled}
      config={{
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
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
          ]
        },
        table: {
          contentToolbar: [
            'tableColumn',
            'tableRow',
            'mergeTableCells',
            'tableCellProperties',
            'tableProperties'
          ]
        },
        image: {
          toolbar: [
            'imageStyle:full',
            'imageStyle:side',
            '|',
            'imageTextAlternative'
          ]
        },
        mediaEmbed: {
          previewsInData: true
        }
      }}
    />
  );
}
