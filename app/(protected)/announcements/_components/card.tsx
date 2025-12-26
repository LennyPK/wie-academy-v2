"use client"

import CategoryBadge from "@/components/category-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Role } from "@/prisma/enums"
import { cn, highlightText } from "@/utils"
import { formatRelative } from "date-fns"
import { Clock, Edit, Eye, EyeOff } from "lucide-react"
import { Announcement } from "../types"

interface AnnouncementCardProps {
  userRole: string
  announcement: Announcement
  searchQuery?: string
  onClick: () => Promise<void>
  onEdit: (announcementId: string) => Promise<void>
  onToggleRead: () => Promise<void>
}

export default function AnnouncementCard({
  userRole,
  announcement,
  searchQuery,
  onClick,
  onEdit,
  onToggleRead,
}: AnnouncementCardProps) {
  const handleAnnouncementClick = () => {
    onClick()
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    onEdit(announcement.id)
  }

  const handleToggleReadStatus = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click/open
    onToggleRead()
  }

  const isRead = announcement.interactions.some((i) => i.isRead)
  const updated = announcement.updatedAt > announcement.createdAt

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          key={announcement.id}
          className={cn(
            "group relative flex h-[270px] flex-col border-0 backdrop-blur-sm transition-all duration-300 md:h-[250px]",
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
              <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                {/* Category badge */}
                <CategoryBadge category={announcement.category} className="w-fit" />

                {/* Created/Updated Date */}
                <div
                  id={`announcement-${announcement.id}-date`}
                  className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground"
                >
                  {announcement.createdAt && (
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
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
              <div
                id={`announcement-${announcement.id}-title`}
                className="mt-4 flex items-start gap-2 md:items-center"
              >
                {/* Status Indicator */}
                {!isRead && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`mt-[0.6rem] h-2 w-2 shrink-0 cursor-default rounded-full md:mt-0 ${
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
                    "line-clamp-2 text-lg font-semibold md:line-clamp-1 md:text-xl",
                    isRead ? "text-muted-foreground" : "text-primary"
                  )}
                >
                  {searchQuery
                    ? highlightText(announcement.title, searchQuery)
                    : announcement.title}
                </CardTitle>
              </div>

              {/* Author */}
              <div
                id={`announcement-${announcement.id}-author`}
                className="mt-2 text-sm font-medium text-muted-foreground"
              >
                {announcement.author ? announcement.author.name : "[deleted]"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <p
              className={cn(
                "line-clamp-2 text-sm md:text-base",
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
              <EyeOff className="h-4 w-4" />
              <span>Mark as Unread</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Mark as Read</span>
            </>
          )}
        </ContextMenuItem>

        {/* Edit option */}
        {userRole !== Role.MEMBER && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleEditClick}>
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
