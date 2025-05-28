// This file contains the code for custom editor component.

import React from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Underline,
  Font,
  Heading,
  BlockQuote,
  Alignment,
  List,
} from "ckeditor5";

interface CKEditorComponentProps {
  value?: string;
  onChange?: (data: string) => void;
  placeholder: string;
}

const CKEditorComponent: React.FC<CKEditorComponentProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        plugins: [
          Essentials,
          Bold,
          Italic,
          Underline,
          Font,
          Heading,
          BlockQuote,
          Alignment,
          List,
        ],
        placeholder: placeholder,
        toolbar: [
          "bold",
          "italic",
          "underline",
          "|",
          "blockQuote",
          "|",
          "fontSize",
          "fontColor",
          "heading",
          "|",
          "alignment",
          "bulletedList",
          "numberedList",
          "|",
          "undo",
          "redo",
        ],
      }}
      data={value}
      onReady={(editor) => {
        console.log("Editor is ready to use!", editor);
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange!(data); // Call the onChange handler passed as a prop
      }}
    />
  );
};

export default CKEditorComponent;
