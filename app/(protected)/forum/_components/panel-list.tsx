"use client"

import Pagination from "@/components/pagination"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { ResizablePanel } from "@/components/ui/resizable"
import { useRouter, useSearchParams } from "next/navigation"
import { ComponentProps } from "react"
import { Post } from "../types"
import ForumEmptyList from "./empty-list"

interface ForumPanelListProps extends ComponentProps<typeof ResizablePanel> {
  posts: Post[]
  totalPages: number
}

export default function ForumPanelList({
  posts,
  totalPages,
  children,
  ...panelProps
}: ForumPanelListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCardClick = (postId: string) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("postId", postId)
    params.delete("mode")

    router.push(`?${params.toString()}`)
  }

  return (
    <ResizablePanel {...panelProps}>
      {/* No posts found */}
      {posts && posts.length === 0 && <ForumEmptyList />}

      {/* TODO: Add post cards here */}
      {posts.map((post) => (
        <Card key={post.id} onClick={() => handleCardClick}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
        </Card>
      ))}
      {/* {Array.from({ length: 10 }).map((_, index) => (
                  <Card key={index} />
                ))} */}

      {children}

      <Pagination totalPages={totalPages} />
    </ResizablePanel>
  )
}
