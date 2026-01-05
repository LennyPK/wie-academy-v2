"use client"

import CategoryBadge from "@/components/category-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Separator } from "@/components/ui/separator"
import { Role } from "@/lib/prisma/enums"
import { cn, highlightText } from "@/lib/utils"
import { format } from "date-fns"
import {
  BadgeCheck,
  Calendar,
  CalendarOff,
  CalendarPlus,
  Clock,
  Edit,
  MapPinIcon,
  QrCode,
  UserLock,
  UserRoundCheck,
  UserRoundPlus,
  UserRoundX,
  Users,
} from "lucide-react"
import { Event } from "../types"

interface EventCardProps {
  userRole: string
  event: Event
  searchQuery?: string
  onClick: () => Promise<void>
  onEdit: (eventId: string) => Promise<void>
  onRegister: () => Promise<void>
  isRegistered: boolean
  isAttended: boolean
}

export default function EventCard({
  userRole,
  event,
  searchQuery,
  onClick,
  onEdit,
  onRegister,
  isRegistered,
  isAttended,
}: EventCardProps) {
  const isPast = new Date() > event.endDateTime
  const isAdmin = userRole === Role.ADMIN
  const isLimitedCapacity = event.capacity !== 0
  const isRegistrationDisabled =
    event._count.registrations >= event.capacity &&
    event.capacity !== 0 &&
    event.registrations.length === 0

  const registrationPercentage = Math.min((event._count.registrations / event.capacity) * 100, 100)
  const isNearCapacity = registrationPercentage >= 80
  const isAtCapacity = registrationPercentage >= 100

  const progressColor = !isLimitedCapacity
    ? "bg-primary"
    : isAtCapacity
      ? "bg-destructive"
      : isNearCapacity
        ? "bg-amber-500"
        : "bg-primary"

  const handleEventClick = () => {
    onClick()
  }

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    onEdit(event.id)
  }

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRegister()
  }

  const userCount = isPast ? (
    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
      <Users className="h-5 w-5" />
      <span>{event._count.participations} attendees</span>
    </div>
  ) : (
    <div className="mb-2 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
          <Users className="h-5 w-5" />
          <span>
            {event.capacity === 0
              ? `${event._count.registrations} registrations`
              : `${event._count.registrations} / ${event.capacity} registrations`}
          </span>
        </div>
        {event.capacity !== 0 && (
          <span className="text-xs text-muted-foreground">
            {Math.round(registrationPercentage)}%
          </span>
        )}
      </div>

      <div className={cn("h-2 overflow-hidden rounded-full bg-muted")}>
        <div
          className={cn("h-full rounded-full transition-all duration-300", progressColor)}
          style={{ width: `${Math.min(registrationPercentage, 100)}%` }}
        />
      </div>
    </div>
  )

  const actions = (() => {
    if (isAdmin) {
      return (
        <Button
          variant={isPast ? "outline" : "default"}
          className="flex cursor-pointer items-center gap-2"
        >
          <QrCode />
          <span>QR Code</span>
        </Button>
      )
    }

    if (isPast) {
      return (
        <Button disabled variant="outline">
          {isAttended ? (
            <>
              <BadgeCheck />
              <span>Attended</span>
            </>
          ) : (
            <>
              <CalendarOff />
              <span>Event Ended</span>
            </>
          )}
        </Button>
      )
    }

    return (
      <Button
        variant={isRegistrationDisabled ? "outline" : isRegistered ? "ghost" : "default"}
        disabled={isRegistrationDisabled}
        className={cn(
          "group flex flex-1 cursor-pointer items-center gap-2",
          isRegistered && "hover:bg-destructive hover:text-destructive-foreground"
        )}
        onClick={handleRegister}
      >
        {(() => {
          if (isRegistrationDisabled) {
            return (
              <>
                <UserLock />
                <span>Event Full</span>
              </>
            )
          }

          if (isRegistered) {
            return (
              <>
                <UserRoundCheck className="group-hover:hidden group-focus-visible:hidden" />
                <span className="group-hover:hidden group-focus-visible:hidden">Registered</span>

                <UserRoundX className="hidden group-hover:inline group-focus-visible:inline" />
                <span className="hidden group-hover:inline group-focus-visible:inline">
                  Unregister
                </span>
              </>
            )
          }

          return (
            <>
              <UserRoundPlus />
              <span>Register</span>
            </>
          )
        })()}
      </Button>
    )
  })()

  const contextMenu = (() => {
    if (isAdmin) {
      return (
        <ContextMenuContent>
          <ContextMenuItem onClick={handleEditClick}>
            <Edit />
            <span>Edit</span>
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem>
            <Users />
            <span>View Attendees</span>
          </ContextMenuItem>

          <ContextMenuItem>
            <QrCode />
            <span>QR Code</span>
          </ContextMenuItem>
        </ContextMenuContent>
      )
    }

    if (isPast) {
      return
    }

    if (isRegistrationDisabled) {
      return
    }

    return isRegistered ? (
      <ContextMenuContent>
        <ContextMenuItem onClick={handleRegister}>
          <UserRoundX />
          <span>Unregister</span>
        </ContextMenuItem>

        <ContextMenuItem>
          <CalendarPlus />
          <span>Add to Calendar</span>
        </ContextMenuItem>
      </ContextMenuContent>
    ) : (
      <ContextMenuContent>
        <ContextMenuItem onClick={handleRegister}>
          <UserRoundPlus />
          <span>Register</span>
        </ContextMenuItem>
      </ContextMenuContent>
    )
  })()

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Card
          key={event.id}
          className={cn(
            "border-0 transition-all duration-300",
            "focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:outline-none",
            isPast ? "bg-muted" : "bg-card"
          )}
          onClick={handleEventClick}
        >
          <CardHeader>
            <CategoryBadge category={event.category} className="w-fit" />

            <CardTitle
              id={event.id}
              className={cn(
                "line-clamp-2 text-lg font-semibold sm:line-clamp-1 sm:text-xl",
                isPast ? "text-muted-foreground" : "text-primary"
              )}
            >
              {searchQuery ? highlightText(event.title, searchQuery) : event.title}
            </CardTitle>
            <CardDescription
              className={cn(
                "line-clamp-2 text-sm sm:text-base",
                isPast ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {searchQuery
                ? highlightText(event.descriptionPlain, searchQuery)
                : event.descriptionPlain}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-2 overflow-hidden">
            <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:grid sm:grid-cols-2 sm:gap-0 sm:text-base">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>{format(event.startDateTime, "EEEE, PP")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{format(event.startDateTime, "p")}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
              <MapPinIcon className="h-5 w-5" />
              <span>{event.location}</span>
            </div>

            <Separator className="my-2" />

            {userCount}

            {actions}
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      {contextMenu}
    </ContextMenu>
  )
}
