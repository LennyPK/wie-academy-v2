"use client"

import { toggleRead } from "@/announcements/actions"
import { Announcement } from "@/announcements/types"
import CategoryBadge from "@/components/category-badge"
import { RenderTipTap } from "@/components/editor/render"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ROUTES } from "@/constants"
import { AnnouncementInteractionType, Role } from "@/prisma/enums"
import { cn } from "@/utils"
import { formatRelative } from "date-fns"
import { BookCheck, BookOpenCheck, BookX, ChevronDown, Clock, Edit } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface AnnouncementDetailProps {
  userId: string
  userRole: string
  announcement: Announcement | null
}

export default function AnnouncementDetail({
  userId,
  userRole,
  announcement,
}: AnnouncementDetailProps) {
  const router = useRouter()
  const pathname = usePathname()

  if (!announcement) return null

  const isRead = announcement.interactions.some((i) => i.type === AnnouncementInteractionType.VIEW)
  const isAdmin = userRole === Role.ADMIN

  const handleToggleRead = async () => {
    await toggleRead(announcement.id, userId, pathname)
  }

  const handleEdit = async () => {
    router.push(`${ROUTES.ANNOUNCEMENTS}/edit/${announcement.id}`)
  }

  const actions = (
    <TooltipProvider>
      <div className="mt-4 flex items-center gap-1 border-y border-border py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={isRead ? "ghost" : "default"}
              onClick={handleToggleRead}
              className={cn("group flex-1 gap-2")}
            >
              {isRead ? (
                <>
                  <BookCheck className="group-hover:hidden group-focus-visible:hidden" />
                  <span className="group-hover:hidden group-focus-visible:hidden">Read</span>

                  <BookX className="hidden group-hover:inline group-focus-visible:inline" />
                  <span className="hidden group-hover:inline group-focus-visible:inline">
                    Mark as Unread
                  </span>
                </>
              ) : (
                <>
                  <BookOpenCheck />
                  <span>Mark as Read</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isRead ? "Mark as unread" : "Mark as read"}</TooltipContent>
        </Tooltip>

        {isAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={handleEdit} className="flex-1 gap-2">
                <Edit />
                <span className="hidden sm:inline">Edit Announcement</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Announcement</TooltipContent>
          </Tooltip>
        )}

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share announcement</TooltipContent>
        </Tooltip> */}

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handleCopyLink} className="gap-1.5">
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Link2 className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy link to clipboard</TooltipContent>
        </Tooltip> */}

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handlePrint} className="gap-1.5">
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Print announcement</TooltipContent>
        </Tooltip> */}
      </div>
    </TooltipProvider>
  )

  const headerTitle = <span className="text-2xl font-bold">{announcement.title}</span>

  const headerDescription = (
    <div className="flex justify-center gap-5 sm:justify-start">
      <div className="text-center text-sm font-medium text-muted-foreground sm:text-left">
        {announcement.author ? announcement.author.name : "[deleted]"}
      </div>
      {announcement.createdAt && (
        <div className="flex items-center justify-center sm:justify-start">
          <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {announcement.updatedAt && announcement.updatedAt > announcement.createdAt
              ? formatRelative(announcement.updatedAt, new Date())
              : formatRelative(announcement.createdAt, new Date())}
          </span>
        </div>
      )}
    </div>
  )

  const header = (
    <div>
      <div className="mb-4 flex justify-center sm:justify-start">
        <CategoryBadge category={announcement.category} className="w-fit" />
      </div>

      {headerTitle}
      {headerDescription}
    </div>
  )

  const bodyContent = (
    <RenderTipTap
      content={
        announcement.contentJson ? JSON.parse(JSON.stringify(announcement?.contentJson)) : undefined
      }
    />
  )

  const targetingGroup = (label: string, values: (string | undefined)[], fallback: string) => (
    <Collapsible className="space-y-1">
      <CollapsibleTrigger className="group flex w-full items-center justify-between py-2 transition-colors hover:text-foreground">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          {values.length > 0 && (
            <Badge variant="outline" className="text-xs font-normal">
              {values.length}
            </Badge>
          )}
          <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-open:rotate-180" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="flex flex-wrap gap-2 pb-2">
          {values.length > 0 ? (
            values.map((value) => (
              <Badge key={value} variant="secondary" className="px-2 text-xs font-normal">
                {value}
              </Badge>
            ))
          ) : (
            <Badge variant="outline" className="px-2 text-xs font-normal">
              {fallback}
            </Badge>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )

  const targeting = (
    <div className="w-full text-xs sm:text-sm">
      {targetingGroup(
        "Regions",
        announcement.targetRegions.map((targetRegion) => targetRegion.region.label),
        "All regions"
      )}

      {targetingGroup(
        "Schools",
        announcement.targetSchools.map((targetSchool) => targetSchool.school.label),
        "All schools"
      )}

      {targetingGroup(
        "Year Levels",
        announcement.targetYearLevels.map((targetYearLevel) => targetYearLevel.yearLevel.label),
        "All year levels"
      )}
    </div>
  )

  return (
    <div>
      <Card>
        <CardContent>
          {header}
          {actions}
          {bodyContent}
        </CardContent>
      </Card>
      <footer className="py-5">{targeting}</footer>
    </div>
  )
}
