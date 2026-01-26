import CategoryBadge from "@/components/category-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { ROUTES } from "@/lib/constants"
import { cn, highlightText } from "@/lib/utils"
import { Role } from "@/prisma/enums"
import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { formatRelative } from "date-fns"
import { Clock, Edit, Flag, Heart, HeartPlus, Lock, MessageSquare, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Post } from "../types"

interface ForumCardProps {
  userId: string
  userRole: string
  post: Post
  searchQuery?: string
  onClick: () => void
  // onEdit:(postId: string)=>Promise<void>
  className?: string
}

export default function ForumCard({
  userId,
  userRole,
  post,
  searchQuery,
  onClick,
  className,
}: ForumCardProps) {
  const router = useRouter()

  if (!post || !post.author) {
    return null
  }

  const isAuthor = post.author.id === userId
  const isAdmin = userRole === Role.ADMIN

  const getAuthorLabel = () => {
    if (post.isAnonymous) {
      return isAuthor ? "Anonymous (You)" : "Anonymous"
    }

    return post.author?.name ?? "[deleted]"
  }

  const handlePostClick = () => {
    onClick()
  }

  const handleEditClick = async () => {
    router.push(`${ROUTES.FORUM}/edit/${post.id}`)
  }

  const contextMenu = (() => {
    if (isAdmin || isAuthor) {
      return (
        <ContextMenuContent>
          <ContextMenuItem onClick={handleEditClick}>
            <Edit />
            <span>Edit</span>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem>
            <Trash2 />
            <span>Delete</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )
    }

    return (
      <ContextMenuContent>
        <ContextMenuItem
        // onClick={handleEditClick}
        >
          <HeartPlus />
          <span>Like</span>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem>
          <Flag />
          <span>Report</span>
        </ContextMenuItem>
      </ContextMenuContent>
    )
  })()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          key={post.id}
          className={cn("border-0 transition-all duration-300", className)}
          onClick={handlePostClick}
        >
          <CardHeader>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
              <CategoryBadge category={post.category} />
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{formatRelative(post.createdAt, new Date())}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {post.isPrivate && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock className="size-3" />
                    </TooltipTrigger>
                    <TooltipContent>Private Post</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <CardTitle className={cn("line-clamp-1 text-lg font-semibold")}>
                {searchQuery ? highlightText(post.title, searchQuery) : post.title}
              </CardTitle>
            </div>

            <CardDescription className="flex items-center font-medium">
              {getAuthorLabel()}
            </CardDescription>
            <CardContent className="flex-1 space-y-2 px-0">
              <p className={cn("line-clamp-2 text-base")}>
                {searchQuery ? highlightText(post.contentPlain, searchQuery) : post.contentPlain}
              </p>

              <div className="flex gap-5">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-4 w-4" />
                  <span>0</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  <span>0</span>
                </div>
              </div>
            </CardContent>
          </CardHeader>
        </Card>
      </ContextMenuTrigger>
      {contextMenu}
    </ContextMenu>
  )
}
