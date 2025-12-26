"use client"

import CategoryBadge from "@/components/category-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Separator } from "@/components/ui/separator"
import { Role } from "@/lib/prisma/enums"
import { cn, highlightText } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar, Clock, Edit, MapPinIcon, UserRoundCheck, Users } from "lucide-react"
import { Event } from "../types"

interface EventCardProps {
  userRole: string
  event: Event
  searchQuery?: string
  onClick: () => Promise<void>
  onEdit: (eventId: string) => Promise<void>
}

export default function EventCard({
  userRole,
  event,
  searchQuery,
  onClick,
  onEdit,
}: EventCardProps) {
  const isPast = new Date() > event.endDateTime
  //  const progressPercentage = (registeredCount / event.capacity) * 100
  const progressPercentage = (0 / event.capacity) * 100
  const isAlmostFull = progressPercentage >= 80
  const isFull = progressPercentage >= 100

  const handleEventClick = () => {
    onClick()
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    onEdit(event.id)
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card key={event.id} onClick={handleEventClick}>
          <CardHeader>
            <CategoryBadge category={event.category} className="w-fit" />

            <CardTitle
              id={event.id}
              className={cn(
                "line-clamp-2 text-lg font-semibold md:line-clamp-1 md:text-xl",
                isPast ? "text-muted-foreground" : "text-primary"
              )}
            >
              {searchQuery ? highlightText(event.title, searchQuery) : event.title}
            </CardTitle>
            <CardDescription
              className={cn(
                "line-clamp-2 text-sm md:text-base",
                isPast ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {searchQuery
                ? highlightText(event.descriptionPlain, searchQuery)
                : event.descriptionPlain}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2 overflow-hidden">
            <div className="grid grid-cols-2 text-sm text-muted-foreground md:text-base">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(event.startDateTime, "EEEE, PP")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{format(event.startDateTime, "p")}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="h-4 w-4" />
              <span>{event.location}</span>
            </div>

            <Separator className="my-2" />

            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground md:text-base">
                <Users className="h-4 w-4" />
                <span>
                  {event.capacity === 0
                    ? `${/* event.registeredCount*/ 10} registrations`
                    : `${/* event.registeredCount*/ 10} / ${event.capacity} registrations`}
                </span>
              </div>
              {event.capacity !== 0 && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              )}
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isFull ? "bg-primary" : isAlmostFull ? "bg-primary/50" : "bg-secondary"
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* Register option */}
        <ContextMenuItem>
          <UserRoundCheck className="h-4 w-4" />
          <span>Register</span>
        </ContextMenuItem>

        {/* Edit option */}
        {userRole !== Role.MEMBER && (
          <ContextMenuItem onClick={handleEditClick}>
            <Edit className="h-4 w-4" />
            <span>Edit</span>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}
