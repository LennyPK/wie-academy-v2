"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { formatRelativeTime } from "@/utils"
import { highlightText } from "@/utils"
import { formatRelative } from "date-fns"
import { Clock, MoreVertical, Pencil } from "lucide-react"
import { Announcement } from "../types"

interface AnnouncementCardProps {
  userRole: string
  announcement: Announcement
  // isRead: boolean
  searchQuery?: string
  // onClick: (announcement: Announcement) => void
  // onEdit: (announcement: Announcement) => void
  // onToggleRead: (id: string) => void
}

export default function AnnouncementCard({
  userRole,
  announcement,
  // isRead,
  searchQuery,
  // onClick,
  // onEdit,
  // onToggleRead,
}: AnnouncementCardProps) {
  // const handleAnnouncementClick = (announcement: Announcement) => {
  //   onClick(announcement)
  // }

  // const handleAnnouncementKeyDown = (
  //   e: React.KeyboardEvent<HTMLDivElement>,
  //   announcement: Announcement
  // ) => {
  //   if (e.key === "Enter" || e.key === " ") {
  //     e.preventDefault()
  //     onClick(announcement)
  //   }
  // }

  // const handleEditClick = (e: React.MouseEvent) => {
  //   e.stopPropagation() // Prevent card click
  //   onEdit(announcement)
  // }

  // const handleReadStatusKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
  //   if (e.key === "Enter" || e.key === " ") {
  //     e.preventDefault()
  //     e.stopPropagation()
  //     onToggleRead(announcement.id)
  //   }
  // }

  // const handleToggleReadStatus = (e: React.MouseEvent, id: string) => {
  //   e.stopPropagation() // Prevent card click/open
  //   onToggleRead(id)
  // }

  return (
    <Card
      key={announcement.id}
      tabIndex={0}
      role="article"
      aria-labelledby={`announcement-${announcement.id}-title`}
      aria-describedby={`announcement-${announcement.id}-date`}
      className="border-0"
      // className={`group relative flex h-[270px] flex-col border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 focus:outline-none md:h-[250px] ${
      //   isRead
      //     ? "bg-white/80"
      //     : `border-l-4 bg-gray-50/80 ${
      //         announcement.updatedAt > announcement.createdAt
      //           ? "border-l-indigo-400"
      //           : "border-l-purple-400"
      //       }`
      // }`}
      // onClick={() => handleAnnouncementClick(announcement)}
      // onKeyDown={(e) => handleAnnouncementKeyDown(e, announcement)}
    >
      <CardHeader className="pb-2">
        <div className="flex h-full flex-col">
          <div className="flex flex-1 flex-col">
            <div className="space-y-2">
              {/* Category badge */}
              <div id={`announcement-${announcement.id}-category`}>
                {/* <CategoryBadge category={announcement.categoryId} className="w-fit" /> */}
              </div>
              {/* Title and status dot */}
              <div
                id={`announcement-${announcement.id}-title`}
                className="mt-4 flex items-start gap-2 md:items-center"
              >
                {/* {!isRead && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className={`mt-[0.6rem] h-2 w-2 shrink-0 cursor-default rounded-full md:mt-0 ${
                            announcement.updatedAt > announcement.createdAt
                              ? "bg-indigo-400"
                              : "bg-purple-400"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{announcement.updatedAt > announcement.createdAt ? "Updated" : "New"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )} */}
                <CardTitle
                  id={announcement.id}
                  // className={`line-clamp-2 text-lg font-semibold md:line-clamp-1 md:text-xl ${
                  //   isRead ? "text-gray-600" : "text-primary"
                  // }`}
                >
                  {searchQuery
                    ? highlightText(announcement.title, searchQuery)
                    : announcement.title}
                </CardTitle>
              </div>
              {announcement.author && (
                <div
                  id={`announcement-${announcement.id}-author`}
                  className="text-sm font-medium text-gray-500"
                >
                  By: {announcement.author.name}
                </div>
              )}
              <div
                id={`announcement-${announcement.id}-date`}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500"
              >
                {announcement.createdAt && (
                  <div className="flex items-center">
                    <Clock className="mr-1 h-3.5 w-3.5" />
                    <span>
                      {announcement.updatedAt > announcement.createdAt
                        ? formatRelative(announcement.updatedAt, new Date())
                        : formatRelative(announcement.createdAt, new Date())}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden py-0 pt-5">
        <p className="line-clamp-2 text-sm md:text-base">
          {searchQuery
            ? highlightText(announcement.contentPlain, searchQuery)
            : announcement.contentPlain}
        </p>
      </CardContent>
      <div className="absolute top-2 right-2 md:top-4 md:right-4">
        {/* Mobile: Dropdown Menu */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 border p-0 hover:bg-purple-400 hover:text-white"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation()
                  // handleToggleReadStatus(e, announcement.id)
                }}
              >
                {/* {isRead ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    <span>Mark as unread</span>
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>Mark as read</span>
                  </>
                )} */}
              </DropdownMenuItem>
              {/* {userRole === "admin" && (
                <DropdownMenuItem onClick={handleEditClick}>
                  <Pencil className="mr-2 h-4 w-4" />
                  <span>Edit announcement</span>
                </DropdownMenuItem>
              )} */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Desktop: Tooltip Buttons */}
        <div className="hidden gap-1 md:flex md:opacity-0 md:transition-opacity md:group-hover:opacity-100">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  // aria-label={isRead ? "Mark as unread" : "Mark as read"}
                  // onClick={(e) => handleToggleReadStatus(e, announcement.id)}
                  // onKeyDown={handleReadStatusKeyDown}
                  className="h-8 w-8 p-0 hover:bg-purple-400 hover:text-white"
                >
                  {/* {isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} */}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {/* <p>{isRead ? "Mark as unread" : "Mark as read"}</p> */}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {userRole === "admin" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Edit announcement"
                    // onClick={handleEditClick}
                    className="h-8 w-8 p-0 hover:bg-purple-400 hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit announcement</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    </Card>
  )
}
