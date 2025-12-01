import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Editor, useEditorState } from "@tiptap/react"
import { CheckIcon, ChevronDown, PaintBucket } from "lucide-react"

export default function TextHighlightPicker({ editor }: { editor: Editor }) {
  const highlightOptions = [
    { name: "None", color: "transparent" },
    { name: "Gray", color: "var(--editor-highlight-gray)" },
    { name: "Brown", color: "var(--editor-highlight-brown)" },
    { name: "Orange", color: "var(--editor-highlight-orange)" },
    { name: "Yellow", color: "var(--editor-highlight-yellow)" },
    { name: "Green", color: "var(--editor-highlight-green)" },
    { name: "Blue", color: "var(--editor-highlight-blue)" },
    { name: "Purple", color: "var(--editor-highlight-purple)" },
    { name: "Pink", color: "var(--editor-highlight-pink)" },
    { name: "Red", color: "var(--editor-highlight-red)" },
  ]
  const editorState = useEditorState({
    editor,
    selector: (state) => ({
      currentHighlight: state.editor.getAttributes("textStyle").backgroundColor,
      isHighlightActive: highlightOptions.find((color) =>
        state.editor.isActive("textStyle", {
          backgroundColor: color.color,
        })
      ),
    }),
  })

  const currentHighlight = editorState.currentHighlight ?? highlightOptions[0].color

  const handleSetHighlight = (color: string) => {
    editor
      .chain()
      .focus()
      .setBackgroundColor(color === currentHighlight ? highlightOptions[0].color : color)
      .run()
  }

  const isDisabled = !editor.can().toggleTextStyle({ backgroundColor: highlightOptions[0].color })

  return (
    <TooltipProvider>
      <Popover>
        <Tooltip>
          <PopoverTrigger disabled={isDisabled} asChild>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "flex h-8 w-14 items-center justify-center gap-2 p-0 font-normal",
                  currentHighlight === highlightOptions[0].color ? "" : "bg-accent"
                )}
              >
                <PaintBucket className="h-4 w-4" />
                <ChevronDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="select-none">
            <p>Background Color</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-5 gap-2">
            {highlightOptions.map(({ name, color }) => (
              <TooltipProvider key={name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSetHighlight(color)}
                      className={cn(
                        "h-8 w-8 rounded-sm p-0 transition-transform hover:scale-105",
                        currentHighlight === color
                          ? "border-2 border-border"
                          : "hover:border-muted-foreground"
                      )}
                      style={{
                        backgroundColor: color,
                      }}
                    >
                      <div className="rounded-sm px-1 py-px font-medium">
                        {currentHighlight === color ? <CheckIcon className="h-4 w-4" /> : "A"}
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="select-none">{name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </TooltipProvider>
  )
}
