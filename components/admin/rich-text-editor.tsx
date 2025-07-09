/**
 * Rich Text Editor Component
 * WYSIWYG editor for content management using React Quill
 */
"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import "react-quill-new/dist/quill.snow.css"

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  height?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  height = "300px",
}: RichTextEditorProps) {
  const quillRef = useRef<any>(null)

  // Quill editor configuration
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
  }

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "align",
    "link",
    "image",
    "color",
    "background",
  ]

  return (
    <div className="bg-white rounded-lg border">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />
    </div>
  )
}
