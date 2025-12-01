import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Editor, useEditorState } from "@tiptap/react"
import { ChevronDown, Heading1, Heading2, Heading3, Type } from "lucide-react"

export default function HeadingDropdown({ editor }: { editor: Editor }) {
  const levels = [1, 2, 3] as const
  const editorState = useEditorState({
    editor,
    selector: (state) => ({
      activeLevel: levels.find((level) => state.editor.isActive("heading", { level })),
    }),
  })

  const activeLevel = editorState.activeLevel

  const headingOptions = [
    {
      icon: <Type className="mr-1 h-5 w-5" />,
      label: "Normal",
      onClick: () => editor.chain().focus().setParagraph().run(),
      style: !editorState.activeLevel && "bg-accent",
      level: null,
    },
    {
      icon: <Heading1 className="mr-1 h-5 w-5" />,
      label: "Heading 1",
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      style: editorState.activeLevel === 1 && "bg-accent",
      level: 1,
    },
    {
      icon: <Heading2 className="mr-1 h-5 w-5" />,
      label: "Heading 2",
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      style: editorState.activeLevel === 2 && "bg-accent",
      level: 2,
    },
    {
      icon: <Heading3 className="mr-1 h-5 w-5" />,
      label: "Heading 3",
      onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      style: editorState.activeLevel === 3 && "bg-accent",
      level: 3,
    },
  ]

  // Get the currently active option using activeLevel
  const activeOption =
    headingOptions.find((option) => option.level === activeLevel) || headingOptions[0]

  return (
    <TooltipProvider>
      <DropdownMenu>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn("h-8 px-2", activeOption !== headingOptions[0] && "bg-accent")}
              >
                {/* <Type className="mr-1 h-4 w-4" /> */}
                {activeOption.icon}
                <ChevronDown className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent className="select-none">
            <p>Headings</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent className="w-auto p-1" align="start">
          <div className="flex flex-col gap-1">
            {headingOptions.map((option) => (
              <DropdownMenuItem
                key={option.level}
                // variant="ghost"
                // size="sm"
                onClick={option.onClick}
                className={cn("flex h-8 items-center justify-start gap-2 px-2", option.style)}
              >
                {option.icon}
                {option.label}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  )
}
