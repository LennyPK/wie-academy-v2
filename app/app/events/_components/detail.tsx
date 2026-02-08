import CategoryBadge from "@/components/category-badge"
import { RenderTipTap } from "@/components/editor/render"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { Role } from "@/lib/prisma/enums"
import { cn } from "@/lib/utils"
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

interface EventDetailProps {
  event: Event | null
  open: boolean
  setOpen: (open: boolean) => void
  userRole: string
  onEdit: (eventId: string) => Promise<void>
  onRegister: () => Promise<void>
  isRegistered: boolean
  isAttended: boolean
}

export default function EventDetail({
  event,
  open,
  setOpen,
  userRole,
  onEdit,
  onRegister,
  isRegistered,
  isAttended,
}: EventDetailProps) {
  const isMobile = useIsMobile()

  if (!event) return null

  const isPast = new Date() > event.endDateTime
  const isAdmin = userRole === Role.ADMIN
  const isLimitedCapacity = event.capacity !== 0
  const isRegistrationDisabled =
    event._count.registrations >= event.capacity &&
    event.capacity !== 0 &&
    event.registrations.length === 0

  const handleRegister = async () => {
    onRegister()
  }

  const handleEdit = async () => {
    onEdit(event.id)
  }

  const registrationPercentage = Math.min((event._count.registrations / event.capacity) * 100, 100)
  const isAlmostFull = registrationPercentage >= 80
  const isFull = registrationPercentage >= 100
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (registrationPercentage / 100) * circumference
  const progressColor = !isLimitedCapacity
    ? "text-primary"
    : isFull
      ? "text-destructive"
      : isAlmostFull
        ? "text-amber-500"
        : "text-primary"

  const capacityGuage = (
    <div className="relative inline-flex items-center justify-center">
      <svg className="h-16 w-16 -rotate-90 transform">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          className="text-muted/20"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-500", progressColor)}
        />
      </svg>
      <div className="absolute flex flex-col items-center text-sm">
        {isPast ? (
          <Users className="h-5 w-5" />
        ) : event.capacity === 0 ? (
          <Users className="h-5 w-5" />
        ) : (
          <div className="leading-none font-bold">{registrationPercentage.toFixed(0)}%</div>
        )}
      </div>
    </div>
  )

  const actions = (() => {
    if (isAdmin) {
      return (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={handleEdit} className="flex-1 gap-2">
                <Edit />
                <span className="hidden sm:inline">Edit Event</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Event</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="flex-1 gap-2">
                <Users />
                <span className="sm:hidden">Attendees</span>
                <span className="hidden sm:inline">View Attendees</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>View Attendees</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="flex-1 gap-2">
                <QrCode />
                <span className="sm:hidden">QR Code</span>
                <span className="hidden sm:inline">View QR Code</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>View QR Code</TooltipContent>
          </Tooltip>
        </>
      )
    }

    if (isPast) {
      return (
        <Button className="flex-1" variant="ghost" disabled>
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

    if (isRegistrationDisabled) {
      return (
        <Button variant="ghost" disabled className="flex flex-1 items-center gap-2">
          <UserLock />
          <span>Event Full</span>
        </Button>
      )
    }

    return (
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            {/* FIXME: Button doesn't update when registration status changes */}
            <Button
              variant={isRegistered ? "ghost" : "default"}
              onClick={handleRegister}
              className={cn(
                "group flex flex-1 items-center gap-2",
                isRegistered && "hover:bg-destructive hover:text-destructive-foreground"
              )}
            >
              {isRegistered ? (
                <>
                  <UserRoundCheck className="group-hover:hidden group-focus-visible:hidden" />
                  <span className="group-hover:hidden group-focus-visible:hidden">Registered</span>

                  <UserRoundX className="hidden group-hover:inline group-focus-visible:inline" />
                  <span className="hidden group-hover:inline group-focus-visible:inline">
                    Unregister
                  </span>
                </>
              ) : (
                <>
                  <UserRoundPlus />
                  <span>Register</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isRegistered ? "Unregister" : "Register"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              hidden={!isRegistered}
              className={cn("flex flex-1 items-center gap-2")}
            >
              <CalendarPlus />
              <span className="hidden sm:inline">Add to Calendar</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add to Calendar</TooltipContent>
        </Tooltip>
      </>
    )
  })()

  const registrationCount = (
    <div className="my-4 flex items-center justify-center gap-2 text-sm sm:my-0 sm:mb-4 sm:text-base">
      {capacityGuage}
      {isPast
        ? `${event._count.participations} attendees`
        : event.capacity === 0
          ? `${event._count.registrations} registrations`
          : `${event._count.registrations} / ${event.capacity} registrations`}
    </div>
  )

  const headerTitle = <span className="text-2xl font-bold">{event.title}</span>

  const details = (
    <div className="mx-5 mt-5 mb-10 flex flex-col gap-4 text-sm text-muted-foreground sm:text-base">
      <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-0">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold sm:text-sm">Start</span>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{format(event.startDateTime, "EEEE, PP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{format(event.startDateTime, "p")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold sm:text-sm">End</span>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>{format(event.endDateTime, "EEEE, PP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>{format(event.endDateTime, "p")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold sm:text-sm">Location</span>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-5 w-5" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  )

  const header = (
    <div>
      <div className="mb-4 flex justify-center sm:justify-start">
        <CategoryBadge category={event.category} className="w-fit" />
      </div>
      <DrawerTitle className="sm:hidden">{headerTitle}</DrawerTitle>

      <DialogTitle className="hidden sm:block">{headerTitle}</DialogTitle>
    </div>
  )

  const bodyContent = (
    <RenderTipTap
      content={
        event.descriptionJson ? JSON.parse(JSON.stringify(event?.descriptionJson)) : undefined
      }
    />
  )

  const content = (
    <Tabs defaultValue="overview">
      <TabsList className="w-full">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">{bodyContent}</TabsContent>
      <TabsContent value="details">{details}</TabsContent>
    </Tabs>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerOverlay className="backdrop-blur-xs" />
        <DrawerContent className="bg-card px-5">
          <DrawerHeader className="text-center">{header}</DrawerHeader>
          <TooltipProvider>
            <div className="flex items-center gap-1 border-y border-border py-3">{actions}</div>
          </TooltipProvider>
          <div className="overflow-y-auto">
            {registrationCount}
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="backdrop-blur-xs" />
      <DialogContent
        aria-describedby={event.id}
        className="flex max-h-[85vh] min-h-[200px] w-full max-w-[800px] min-w-[320px] flex-col overflow-hidden bg-card sm:max-w-[960px]"
      >
        <DialogHeader>{header}</DialogHeader>

        <TooltipProvider>
          <div className="mt-4 flex items-center gap-1 border-y border-border py-3">{actions}</div>
        </TooltipProvider>
        <div className="overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {registrationCount}
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}
