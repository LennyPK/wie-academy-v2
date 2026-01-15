"use client"

import { ResizablePanel } from "@/components/ui/resizable"
import { ComponentProps } from "react"
import { Post } from "../types"
import ForumDetail from "./detail"
import ForumEmptyContent from "./empty-content"
import ForumForm from "./form"

interface ForumPanelContentProps extends ComponentProps<typeof ResizablePanel> {
  userId: string
  userRole: string

  mode?: "create" | "edit"
  post?: Post
}

export default function ForumPanelContent({
  userId,
  userRole,

  mode,
  post,
  children,
  ...panelProps
}: ForumPanelContentProps) {
  return (
    <ResizablePanel {...panelProps}>
      {!post && !mode && <ForumEmptyContent />}

      {mode === "create" && <ForumForm />}

      {post && !mode && <ForumDetail userId={userId} userRole={userRole} post={post} />}

      {children}
    </ResizablePanel>
  )
}
