import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Editor, useEditorState } from "@tiptap/react"
import { Bold, Italic, Strikethrough, Underline } from "lucide-react"

export default function MarkGroup({ editor }: { editor: Editor }) {
  const editorState = useEditorState({
    editor,
    selector: (state) => ({
      isBoldActive: state.editor.isActive("bold"),
      isItalicActive: state.editor.isActive("italic"),
      isUnderlineActive: state.editor.isActive("underline"),
      isStrikeActive: state.editor.isActive("strike"),
    }),
  })

  const markOptions = [
    {
      tooltip: "Bold",
      icon: <Bold className="size-4" />,
      onPress: () => editor.chain().focus().toggleBold().run(),
      pressed: editorState.isBoldActive,
    },
    {
      tooltip: "Italic",
      icon: <Italic className="size-4" />,
      onPress: () => editor.chain().focus().toggleItalic().run(),
      pressed: editorState.isItalicActive,
    },
    {
      tooltip: "Underline",
      icon: <Underline className="size-4" />,
      onPress: () => editor.chain().focus().toggleUnderline().run(),
      pressed: editorState.isUnderlineActive,
    },
    {
      tooltip: "Strikethrough",
      icon: <Strikethrough className="size-4" />,
      onPress: () => editor.chain().focus().toggleStrike().run(),
      pressed: editorState.isStrikeActive,
    },
  ]

  return (
    <>
      {markOptions.map((option, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  key={index}
                  pressed={option.pressed}
                  onPressedChange={() => {
                    option.onPress()
                    console.log(`${option.tooltip} pressed: ${option.pressed}`)
                  }}
                  variant="default"
                  size="sm"
                  className="h-9 w-9 shrink-0 touch-manipulation p-0"
                >
                  {option.icon}
                </Toggle>
              </span>
            </TooltipTrigger>
            <TooltipContent className="select-none">
              <p>{option.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </>
  )
}
