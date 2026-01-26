"use client"

import CategoryBadge from "@/components/category-badge"
import { RenderTipTap } from "@/components/editor/render"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Role } from "@/lib/prisma/enums"
import { formatRelative } from "date-fns"
import { Clock, Edit, Eye, Heart, HeartPlus, Lock, MessageSquare, Trash2 } from "lucide-react"
import { PostWithReply } from "../types"
import ReplyList from "./reply-list"

interface ForumDetailProps {
  userId: string
  userRole: string

  post: PostWithReply
}

export default function ForumDetail({ userId, userRole, post }: ForumDetailProps) {
  if (!post) {
    return null
  }

  const authorAvatarUrl = post.author?.image
  const authorInitials = post.isAnonymous
    ? "A"
    : (post.author?.firstName?.[0] ?? "") + (post.author?.lastName?.[0] ?? "")
  const isAuthor = post.author?.id === userId

  const isAdmin = userRole === Role.ADMIN

  const getAuthorLabel = () => {
    if (post.isAnonymous) {
      return isAuthor ? "Anonymous (You)" : "Anonymous"
    }

    if (!post.author) {
      return "[deleted]"
    }

    const { firstName, lastName } = post.author

    return `${firstName} ${lastName[0]}.`
  }

  const actions = (() => {
    if (isAuthor || isAdmin) {
      return (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="flex-1 cursor-pointer gap-2">
                <Edit />
                <span className="hidden sm:inline">Edit Post</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Post</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="flex-1 cursor-pointer gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 />
                <span className="hidden sm:inline">Delete Post</span>
                <span className="sm:hidden">Delete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Post</TooltipContent>
          </Tooltip>
        </>
      )
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="flex-1 cursor-pointer gap-2">
            <HeartPlus />
            <span className="hidden sm:inline">Like Post</span>
            <span className="sm:hidden">Like</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Like Post</TooltipContent>
      </Tooltip>
    )
  })()

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
            <div className="flex gap-2">
              <CategoryBadge category={post.category} />
              {post.isPrivate && (
                <Badge className="rounded-md border bg-secondary py-1 font-bold text-secondary-foreground uppercase select-none">
                  Private
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{formatRelative(post.createdAt, new Date())}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.isPrivate && <Lock className="size-4" />}
            <CardTitle className="text-xl">{post.title}</CardTitle>
          </div>
          <CardDescription className="my-2 flex items-center gap-2 font-medium">
            <Avatar className="h-10 w-10">
              {authorAvatarUrl ? (
                <AvatarImage src={authorAvatarUrl} alt="User avatar" />
              ) : (
                <AvatarFallback className="bg-linear-to-br from-primary to-secondary font-semibold text-foreground">
                  {authorInitials}
                </AvatarFallback>
              )}
            </Avatar>
            {getAuthorLabel()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <div className="flex items-center gap-1 border-y border-border py-3">{actions}</div>
          </TooltipProvider>

          <RenderTipTap
            content={post.contentJson ? JSON.parse(JSON.stringify(post.contentJson)) : undefined}
          />
        </CardContent>
      </Card>

      <div className="flex gap-5 px-2 py-5">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Heart className="h-4 w-4" />
          <span>0 likes</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageSquare className="h-4 w-4" />
          <span>0 replies</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Eye className="h-4 w-4" />
          <span>0 views</span>
        </div>
      </div>

      <ReplyList
        userId={userId}
        postId={post.id}
        postIsPrivate={post.isPrivate}
        postReplies={post.postReplies}
      />
    </div>
  )
}
