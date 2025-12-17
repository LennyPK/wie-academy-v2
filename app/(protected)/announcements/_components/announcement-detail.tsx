"use client"

import { useIsMobile } from "@/hooks/use-mobile"

import { RenderTipTap } from "@/components/editor/render"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogOverlay } from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Role } from "@/prisma/enums"
import { DialogTitle } from "@radix-ui/react-dialog"
import { formatRelative } from "date-fns"
import { BookCheck, BookOpenCheck, Clock, Pencil } from "lucide-react"
import { Announcement } from "../types"
import CategoryBadge from "./category-badge"

interface AnnouncementDetailProps {
  announcement: Announcement | null
  open: boolean
  setOpen: (open: boolean) => void
  userRole: string
  onToggleRead: (announcementId: string) => Promise<void>
  onEdit: (announcementId: string) => Promise<void>
}

export default function AnnouncementDetail({
  announcement,
  open,
  setOpen,
  userRole,
  onToggleRead,
  onEdit,
}: AnnouncementDetailProps) {
  const isMobile = useIsMobile()

  const isRead = announcement ? announcement.interactions.some((i) => i.isRead) : false
  const isAdmin = userRole === Role.ADMIN

  if (!announcement) return null

  const handleToggleRead = async () => {
    onToggleRead(announcement.id)
  }

  const handleEdit = async () => {
    onEdit(announcement.id)
  }

  const actions = (
    <TooltipProvider>
      <div className="mt-4 flex items-center gap-1 border-y border-border py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            {/* FIXME: Button doesn't update when read status changes */}
            <Button
              variant={isRead ? "ghost" : "default"}
              size="icon"
              onClick={handleToggleRead}
              className="flex-1 cursor-pointer gap-1.5"
            >
              {isRead ? <BookCheck className="h-4 w-4" /> : <BookOpenCheck className="h-4 w-4" />}
              <span className="sm:inline">{isRead ? "Read" : "Mark as read"}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isRead ? "Mark as unread" : "Mark as read"}</TooltipContent>
        </Tooltip>

        {isAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="flex-1 cursor-pointer gap-1.5"
              >
                <Pencil className={"h-4 w-4 fill-current"} />
                <span className="sm:inline">Edit Announcement</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{"Edit Announcement"}</TooltipContent>
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
    <div className="flex justify-center gap-5 md:justify-start">
      <div className="text-center text-sm font-medium text-muted-foreground md:text-left">
        {announcement.author ? `By: ${announcement.author.name}` : "[deleted]"}
      </div>
      {announcement.createdAt && (
        <div className="flex items-center justify-center md:justify-start">
          <Clock className="mr-1 h-3 w-3 text-muted-foreground" />
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
      <div className="mb-4 flex justify-center md:justify-start">
        <CategoryBadge category={announcement.category} className="w-fit" />
      </div>
      <DrawerTitle className="md:hidden">{headerTitle}</DrawerTitle>
      <div className="mt-2 md:hidden">{headerDescription}</div>

      <DialogTitle className="hidden md:block">{headerTitle}</DialogTitle>
      <div className="mt-2 hidden sm:block">{headerDescription}</div>
    </div>
  )

  const bodyContent = (
    <RenderTipTap
      content={
        announcement.contentJson ? JSON.parse(JSON.stringify(announcement?.contentJson)) : undefined
      }
    />
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerOverlay className="backdrop-blur-xs" />
        <DrawerContent className="bg-card">
          <DrawerHeader className="text-center">{header}</DrawerHeader>
          <div className="px-5">
            {actions}
            {bodyContent}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="backdrop-blur-xs" />
      <DialogContent
        aria-describedby={announcement.id}
        className="no-scrollbar flex max-h-[85vh] min-h-[200px] w-full max-w-[800px] min-w-[320px] flex-col overflow-hidden bg-card sm:max-w-[960px]"
      >
        <DialogHeader>{header}</DialogHeader>
        {actions}
        {bodyContent}
      </DialogContent>
    </Dialog>
  )
}
