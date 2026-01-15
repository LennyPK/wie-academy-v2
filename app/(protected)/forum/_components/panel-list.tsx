"use client"

import Pagination from "@/components/pagination"
import { ResizablePanel } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { ComponentProps } from "react"
import { Post } from "../types"
import ForumCard from "./card"
import ForumEmptyList from "./empty-list"

interface ForumPanelListProps extends ComponentProps<typeof ResizablePanel> {
  userId: string
  posts: Post[]
  totalPages: number
}

export default function ForumPanelList({
  userId,
  posts,
  totalPages,
  children,
  ...panelProps
}: ForumPanelListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get("query") ?? ""
  const selectedPostId = searchParams.get("postId") ?? undefined

  const handleCardClick = (postId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("postId", postId)
    params.delete("mode")

    router.push(`?${params.toString()}`)
  }

  return (
    <ResizablePanel {...panelProps} className="space-y-6">
      {/* No posts found */}
      {posts && posts.length === 0 && <ForumEmptyList />}

      {/* TODO: Add post cards here */}
      {posts.map((post) => (
        <ForumCard
          key={post.id}
          userId={userId}
          post={post}
          searchQuery={searchQuery}
          onClick={() => handleCardClick(post.id)}
          className={cn(
            selectedPostId === post.id
              ? "bg-secondary"
              : "cursor-pointer hover:bg-accent hover:shadow-lg"
          )}
        />
      ))}

      {children}

      <Pagination totalPages={totalPages} />
    </ResizablePanel>
  )
}
