import { Editor } from "@tiptap/react"
import HeadingDropdown from "./toolbar-items/headings"
import MarkGroup from "./toolbar-items/mark"
import TextColorPicker from "./toolbar-items/text-color"
import TextHighlightPicker from "./toolbar-items/text-highlight"

export default function Toolbar({
  editor,
  // onImageUpload,
}: {
  editor: Editor | null
  // onImageUpload?: (file: File) => Promise<string>
}) {
  if (!editor) {
    return null
  }

  return (
    <div className="scrollbar-hide sticky top-0 z-20 mb-2 flex w-full flex-wrap items-center gap-1 overflow-x-auto rounded-md border border-input bg-background p-1">
      <HeadingDropdown editor={editor} />
      <MarkGroup editor={editor} />
      {/* <ImageUpload editor={editor} onImageUpload={onImageUpload} /> */}
      <TextColorPicker editor={editor} />
      <TextHighlightPicker editor={editor} />
    </div>
  )
}
