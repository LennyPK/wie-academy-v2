import { ResizablePanel } from "@/components/ui/resizable"
import { ComponentProps } from "react"
import { Post } from "../types"
import ForumEmptyContent from "./empty-content"
import ForumForm from "./form"

interface ForumPanelContentProps extends ComponentProps<typeof ResizablePanel> {
  mode?: "create" | "edit"
  post?: Post
}

export default function ForumPanelContent({
  mode,
  post,
  children,
  ...panelProps
}: ForumPanelContentProps) {
  return (
    <ResizablePanel {...panelProps}>
      {!post && !mode && <ForumEmptyContent />}

      {mode === "create" && <ForumForm />}

      {children}
    </ResizablePanel>
  )
}
