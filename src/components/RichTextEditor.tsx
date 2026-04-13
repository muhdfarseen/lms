import { useEffect, useRef } from "react"
import Quill from "quill"
import "quill/dist/quill.snow.css"

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  readOnly?: boolean
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter content...",
  readOnly = false,
}: RichTextEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const quillRef = useRef<Quill | null>(null)
  const isUpdateFromProps = useRef(false)
  const isInitialized = useRef(false)

  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return

    // Initialize Quill only once
    const quill = new Quill(containerRef.current, {
      theme: "snow",
      placeholder,
      readOnly,
      modules: {
        toolbar: [
          [{ header: [2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
    })

    quillRef.current = quill
    isInitialized.current = true

    // Set initial content
    if (value) {
      isUpdateFromProps.current = true
      quill.root.innerHTML = value
      isUpdateFromProps.current = false
    }

    // Handle changes
    const handleChange = () => {
      if (!isUpdateFromProps.current) {
        onChange(quill.root.innerHTML)
      }
    }

    quill.on("text-change", handleChange)

    return () => {
      quill.off("text-change", handleChange)
    }
  }, [])

  // Update content when prop changes
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      isUpdateFromProps.current = true
      quillRef.current.root.innerHTML = value
      isUpdateFromProps.current = false
    }
  }, [value])

  // Update readOnly state
  useEffect(() => {
    if (quillRef.current) {
      quillRef.current.enable(!readOnly)
    }
  }, [readOnly])

  return (
    <div className="flex flex-col">
      <div
        ref={containerRef}
        className="rounded-lg border border-input bg-background
        [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-input
        [&_.ql-container]:font-sans
        [&_.ql-editor]:min-h-64 [&_.ql-editor]:max-h-64 [&_.ql-editor]:overflow-y-auto
        [&_.ql-editor.ql-blank::before]:text-muted-foreground"
      />
    </div>
  )
}
