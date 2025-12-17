import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Editor, useEditorState } from "@tiptap/react"
import { CheckIcon, ChevronDown } from "lucide-react"

export default function TextColorPicker({ editor }: { editor: Editor }) {
  const colorOptions = [
    { name: "Default", color: "var(--editor-text-default)" },
    { name: "Gray", color: "var(--editor-text-gray)" },
    { name: "Brown", color: "var(--editor-text-brown)" },
    { name: "Orange", color: "var(--editor-text-orange)" },
    { name: "Yellow", color: "var(--editor-text-yellow)" },
    { name: "Green", color: "var(--editor-text-green)" },
    { name: "Blue", color: "var(--editor-text-blue)" },
    { name: "Purple", color: "var(--editor-text-purple)" },
    { name: "Pink", color: "var(--editor-text-pink)" },
    { name: "Red", color: "var(--editor-text-red)" },
  ]

  const editorState = useEditorState({
    editor,
    selector: (state) => ({
      currentColor: state.editor.getAttributes("textStyle").color,
      isColorActive: colorOptions.find((color) =>
        state.editor.isActive("textStyle", {
          color: color.color,
        })
      ),
    }),
  })
  const currentColor = editorState.currentColor ?? colorOptions[0].color

  const handleSetColor = (color: string) => {
    editor
      .chain()
      .focus()
      .setColor(color === currentColor ? colorOptions[0].color : color)
      .run()
  }

  const isDisabled = !editor.can().toggleTextStyle({ color: colorOptions[0].color })

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
                  currentColor === colorOptions[0].color ? "" : "bg-accent"
                )}
              >
                <span className="text-md">A</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent className="select-none">
            <p>Text Color</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="grid grid-cols-5 gap-2">
            {colorOptions.map(({ name, color }) => (
              <TooltipProvider key={name}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSetColor(color)}
                      className={cn(
                        "h-8 w-8 rounded-sm p-0 transition-transform hover:scale-105",
                        currentColor === color
                          ? "border-2 border-border"
                          : "hover:border-muted-foreground"
                      )}
                    >
                      <div className="rounded-sm px-1 py-px font-medium" style={{ color: color }}>
                        {currentColor === color ? <CheckIcon className="h-4 w-4" /> : "A"}
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
