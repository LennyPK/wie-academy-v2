"use client"

import { cn } from "@/lib/utils"
import { Image } from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyleKit } from "@tiptap/extension-text-style"
import { Placeholder } from "@tiptap/extensions"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Toolbar from "./toolbar"

interface RichTextEditorProps {
  placeholder: string
  onChangePlainText: (content: string) => void
  onChangeJSON: (json: object) => void
  onChangeHTML: (content: string) => void
  // initialContent?: object
  className?: string
  // onImageUpload?: (file: File) => Promise<string>
}

export default function RichTextEditor({
  placeholder,
  onChangePlainText,
  onChangeHTML,
  onChangeJSON,
  // initialContent,
  className,
  // onImageUpload,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      // ProfanityFilter,
      TextAlign.configure({
        types: ["heading", "paragraph", "bulletList", "orderedList"],
      }),
      TextStyleKit,
      Image,
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: placeholder,
      }),
    ],
    // content: initialContent,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none break-words overflow-wrap-anywhere",
      },
    },
    onUpdate: ({ editor }) => {
      onChangeHTML(editor.getHTML())
      onChangePlainText(editor.getText())
      onChangeJSON(editor.getJSON())
    },
  })

  return (
    <div
      className={cn(
        "no-scrollbar relative max-h-[calc(100dvh-6rem)] w-full overflow-hidden overflow-y-scroll bg-card pb-[60px] sm:pb-0",
        className
      )}
    >
      {/* <Toolbar editor={editor} onImageUpload={onImageUpload} /> */}
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-w-full overflow-hidden rounded-md border border-input"
      />
    </div>
  )
}
