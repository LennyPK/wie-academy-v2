import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import { TextStyleKit } from "@tiptap/extension-text-style"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export function RenderTipTap({ content }: { content: object }) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit,
      // ProfanityFilter,
      TextAlign.configure({
        types: ["heading", "paragraph", "bulletList", "orderedList"],
      }),
      TextStyleKit,
      Image,
    ],
    content: content,
    // Don't render immediately on the server to avoid SSR issues
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none break-words overflow-wrap-anywhere",
      },
    },
  })

  return <EditorContent className="render min-w-full overflow-hidden rounded-md" editor={editor} />
}
