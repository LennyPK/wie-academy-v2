"use client"

import Pagination from "@/components/pagination"
import { cn } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { Post } from "../types"
import ForumCard from "./card"
import ForumEmptyList from "./list-empty"

interface ForumListProps {
  userId: string
  posts: Post[]
  totalPages: number
}

export default function ForumList({ userId, posts, totalPages }: ForumListProps) {
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
    <div className="space-y-6">
      {/* No posts found */}
      {posts && posts.length === 0 && <ForumEmptyList />}

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

      <Pagination totalPages={totalPages} />
    </div>
  )
}
