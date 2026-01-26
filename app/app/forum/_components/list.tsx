"use client"

import { cn } from "@/lib/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Post } from "../types"
import ForumCard from "./card"

interface ForumListProps {
  userId: string
  userRole: string
  posts: Post[]
  totalPages: number
}

export default function ForumList({ userId, userRole, posts }: ForumListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const searchQuery = searchParams.get("query") ?? ""

  const handleCardClick = (postId: string) => {
    router.push(`${pathname}/post/${postId}`)
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {posts.map((post) => (
        <ForumCard
          key={post.id}
          userId={userId}
          userRole={userRole}
          post={post}
          searchQuery={searchQuery}
          onClick={() => handleCardClick(post.id)}
          className={cn("cursor-pointer hover:bg-accent hover:shadow-lg")}
        />
      ))}
    </div>
  )
}
