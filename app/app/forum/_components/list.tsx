"use client"

import { cn } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { Post } from "../types"
import ForumCard from "./card"

interface ForumListProps {
  userId: string
  userRole: string
  posts: Post[]
}

export default function ForumList({ userId, userRole, posts }: ForumListProps) {
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get("query") ?? ""

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {posts.map((post) => (
        <ForumCard
          key={post.id}
          userId={userId}
          userRole={userRole}
          post={post}
          searchQuery={searchQuery}
          className={cn("cursor-pointer hover:bg-accent hover:shadow-lg")}
        />
      ))}
    </div>
  )
}
