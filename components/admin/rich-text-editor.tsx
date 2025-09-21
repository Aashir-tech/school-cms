"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
// Import Quill's core and snow theme styles
import "react-quill-new/dist/quill.snow.css";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  height = "300px",
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null);

  // Quill editor configuration remains the same
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header", "bold", "italic", "underline", "strike", "list", "bullet",
    "indent", "align", "link", "image", "color", "background",
  ];

  return (
    // The outer container controls the overall size and shadow.
    <div
      className="relative rounded-lg overflow-hidden shadow-sm border border-border"
      style={{ height: height }}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        // The className is simplified as global styles will handle the theming.
        className="h-full"
      />
      {/* Custom global styles to override Quill's default theme.
        All hardcoded colors have been replaced with theme-aware CSS variables.
      */}
      <style jsx global>{`
        /* Main container and editor area */
        .ql-container {
          border: none !important;
          background-color: hsl(var(--card));
          color: hsl(var(--foreground));
          height: calc(100% - 42px); /* Adjust height to fill container, accounting for toolbar */
          overflow-y: auto;
          font-size: 1rem;
        }
        .ql-editor {
          min-height: 100%;
          padding: 1.5rem;
        }
        .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
          left: 1.5rem;
        }
        .ql-editor a {
          color: hsl(var(--primary));
        }

        /* Toolbar */
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          background-color: hsl(var(--muted));
          color: hsl(var(--muted-foreground));
        }

        /* Toolbar icons and pickers */
        .ql-toolbar.ql-snow .ql-stroke {
          stroke: hsl(var(--muted-foreground));
        }
        .ql-toolbar.ql-snow .ql-fill {
          fill: hsl(var(--muted-foreground));
        }
        .ql-toolbar.ql-snow .ql-picker {
          color: hsl(var(--muted-foreground));
        }

        /* Hover and active states for toolbar buttons */
        .ql-toolbar.ql-snow button:hover,
        .ql-toolbar.ql-snow .ql-picker-label:hover {
          background-color: hsl(var(--accent));
          border-radius: 0.25rem;
        }
        .ql-toolbar.ql-snow button:hover .ql-stroke,
        .ql-toolbar.ql-snow .ql-picker-label:hover .ql-stroke {
          stroke: hsl(var(--primary));
        }
        .ql-toolbar.ql-snow button.ql-active,
        .ql-toolbar.ql-snow .ql-picker-label.ql-active {
          background-color: hsl(var(--primary) / 0.1);
        }
        .ql-toolbar.ql-snow button.ql-active .ql-stroke,
        .ql-toolbar.ql-snow .ql-picker-label.ql-active .ql-stroke {
          stroke: hsl(var(--primary));
        }
        
        /* Dropdown options (color, header, etc.) */
        .ql-snow .ql-picker.ql-expanded .ql-picker-options {
          background-color: hsl(var(--popover));
          border: 1px solid hsl(var(--border));
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .ql-snow .ql-picker-options .ql-picker-item {
            color: hsl(var(--popover-foreground));
        }
        .ql-snow .ql-picker-options .ql-picker-item:hover {
          background-color: hsl(var(--accent));
        }
        .ql-snow .ql-picker-options .ql-picker-item.ql-selected {
          background-color: hsl(var(--primary) / 0.1);
          color: hsl(var(--primary));
        }
      `}</style>
    </div>
  );
}
