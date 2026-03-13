"use client"

import { markAsRead, toggleRead } from "@/announcements/actions"
import { Announcement } from "@/announcements/types"
import CategoryBadge from "@/components/category-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ROUTES } from "@/constants"
import { AnnouncementInteractionType, Role } from "@/prisma/enums"
import { cn, highlightText } from "@/utils"
import { formatRelative } from "date-fns"
import { Clock, Edit, Eye, EyeOff } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface AnnouncementCardProps {
  userId: string
  userRole: string
  announcement: Announcement
  searchQuery?: string
}

export default function AnnouncementCard({
  userId,
  userRole,
  announcement,
  searchQuery,
}: AnnouncementCardProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleAnnouncementClick = async () => {
    await markAsRead(announcement.id, userId)
    router.push(`${ROUTES.ANNOUNCEMENTS}/${announcement.id}`)
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    router.push(`${ROUTES.ANNOUNCEMENTS}/edit/${announcement.id}`)
  }

  const handleToggleReadStatus = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click/open
    await toggleRead(announcement.id, userId, pathname)
  }

  const isRead = announcement.interactions.some(
    (i) => i.type === AnnouncementInteractionType.VIEW && i.userId === userId
  )
  const updated = announcement.updatedAt > announcement.createdAt

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          key={announcement.id}
          className={cn(
            "min-h-62.5 flex-col border-0 transition-all duration-100",
            "focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:outline-none",
            isRead
              ? "bg-muted"
              : ["border-l-4", updated ? "border-l-secondary" : "border-l-primary"]
          )}
          onClick={handleAnnouncementClick}
        >
          <CardHeader>
            <div className="flex flex-col">
              {/* Category & Date Container */}
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                {/* Category badge */}
                <CategoryBadge category={announcement.category} className="w-fit" />

                {/* Created/Updated Date */}
                <div className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
                  {announcement.createdAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="flex items-center">
                        {announcement.updatedAt > announcement.createdAt
                          ? formatRelative(announcement.updatedAt, new Date())
                          : formatRelative(announcement.createdAt, new Date())}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Title and status dot */}
              <div className="mt-4 flex items-start gap-2 sm:items-center">
                {/* Status Indicator */}
                {!isRead && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`mt-[0.6rem] h-2 w-2 shrink-0 cursor-default rounded-full sm:mt-0 ${
                            updated ? "bg-secondary" : "bg-primary"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{updated ? "Updated" : "New"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}

                {/* Card Title */}
                <CardTitle
                  id={announcement.id}
                  className={cn(
                    "line-clamp-2 text-lg font-semibold sm:line-clamp-1 sm:text-xl",
                    isRead ? "text-muted-foreground" : "text-primary"
                  )}
                >
                  {searchQuery
                    ? highlightText(announcement.title, searchQuery)
                    : announcement.title}
                </CardTitle>
              </div>

              {/* Author */}
              <CardDescription className="mt-2 font-medium">
                {announcement.author ? announcement.author.name : "[deleted]"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <p
              className={cn(
                "line-clamp-2 text-sm sm:text-base",
                isRead ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {searchQuery
                ? highlightText(announcement.contentPlain, searchQuery)
                : announcement.contentPlain}
            </p>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* Read/Unread option */}
        <ContextMenuItem onClick={handleToggleReadStatus}>
          {isRead ? (
            <>
              <EyeOff />
              <span>Mark as Unread</span>
            </>
          ) : (
            <>
              <Eye />
              <span>Mark as Read</span>
            </>
          )}
        </ContextMenuItem>

        {/* Edit option */}
        {userRole !== Role.MEMBER && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleEditClick}>
              <Edit />
              <span>Edit</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
