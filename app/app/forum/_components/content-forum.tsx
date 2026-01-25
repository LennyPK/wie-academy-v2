"use client"

import { Post } from "../types"
import ForumEmptyContent from "./content-empty"
import ForumDetail from "./detail"
import ForumForm from "./form"

interface ForumContentProps {
  userId: string
  userRole: string

  mode?: "create" | "edit"
  post?: Post
}

export default function ForumContent({
  userId,
  userRole,

  mode,
  post,
}: ForumContentProps) {
  return (
    <div>
      {!post && !mode && <ForumEmptyContent />}

      {mode === "create" && <ForumForm />}

      {post && !mode && <ForumDetail userId={userId} userRole={userRole} post={post} />}
    </div>
  )
}
