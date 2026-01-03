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
  Calendar,
  CalendarPlus,
  Clock,
  MapPinIcon,
  Pencil,
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
}

export default function EventDetail({
  event,
  open,
  setOpen,
  userRole,
  onEdit,
  onRegister,
  isRegistered,
}: EventDetailProps) {
  const isMobile = useIsMobile()

  const isAdmin = userRole === Role.ADMIN

  if (!event) return null

  //  const progressPercentage = (registeredCount / event.capacity) * 100
  // const progressPercentage = (0 / event.capacity) * 100
  // const isAlmostFull = progressPercentage >= 80
  // const isFull = progressPercentage >= 100

  const isPast = new Date() > event.endDateTime
  const isLimitedCapacity = event.capacity !== 0

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
          // <div className="text-sm leading-none font-bold">{registered}</div>
          <div className="leading-none font-bold">{registrationPercentage.toFixed(0)}%</div>
        )}
        {/* <div className="text-sm leading-none font-bold">{registered}</div>
        <div className="text-[10px] leading-none text-muted-foreground">of {capacity}</div> */}
      </div>
    </div>
  )

  const actions = (
    <TooltipProvider>
      <div className="mt-4 flex items-center gap-1 border-y border-border py-3">
        <Tooltip>
          <TooltipTrigger asChild>
            {/* FIXME: Button doesn't update when registration status changes */}
            <Button
              variant={isRegistered ? "ghost" : "default"}
              onClick={handleRegister}
              className={cn(
                "group flex flex-1 cursor-pointer items-center gap-2",
                isRegistered && "hover:bg-destructive hover:text-destructive-foreground"
              )}
            >
              {isRegistered ? (
                <>
                  <UserRoundCheck className="h-5 w-5 group-hover:hidden group-focus-visible:hidden" />
                  <span className="group-hover:hidden group-focus-visible:hidden">Registered</span>

                  <UserRoundX className="hidden h-5 w-5 group-hover:inline group-focus-visible:inline" />
                  <span className="hidden group-hover:inline group-focus-visible:inline">
                    Unregister
                  </span>
                </>
              ) : (
                <>
                  <UserRoundPlus className="h-5 w-5" />
                  <span>Register</span>
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isRegistered ? "Unregister" : "Register"}</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className={cn("flex flex-1 cursor-pointer items-center gap-2")}>
              <CalendarPlus className="h-5 w-5" />
              <span className="hidden sm:inline">Add to Calendar</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add to Calendar</TooltipContent>
        </Tooltip>

        {isAdmin && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="flex-1 cursor-pointer gap-2"
              >
                <Pencil className="h-5 w-5" />
                <span className="hidden sm:inline">Edit Event</span>
                <span className="sm:hidden">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Event</TooltipContent>
          </Tooltip>
        )}

        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" onClick={handleShare} className="gap-1.5">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share event</TooltipContent>
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
          <TooltipContent>Print event</TooltipContent>
        </Tooltip> */}
      </div>
    </TooltipProvider>
  )

  const registrationCount = (
    <div className="flex items-center justify-center gap-2 text-sm sm:text-base">
      {/* <CapacityGauge registered={0} capacity={event.capacity} /> */}
      {/* <CapacityGauge registered={10} capacity={10} /> */}
      {capacityGuage}
      {/* {isPast ? `${event._count.participations} attendees` : event._count.registrations}{" "}
      {event.capacity !== 0 && `/ ${event.capacity}`} registrations */}
      {isPast
        ? `${event._count.participations} attendees`
        : event.capacity === 0
          ? `${event._count.registrations} registrations`
          : `${event._count.registrations} / ${event.capacity} registrations`}
    </div>
    // <>
    //   <div className="mb-2 flex items-center justify-between">
    //     <div className="flex items-center gap-2 text-sm text-muted-foreground sm:text-base">
    //       <Users className="h-4 w-4" />
    //       <span>
    //         {event.capacity === 0
    //           ? `${/* event.registeredCount*/ 10} registrations`
    //           : `${/* event.registeredCount*/ 10} / ${event.capacity} registrations`}
    //       </span>
    //     </div>
    //     {event.capacity !== 0 && (
    //       <span className="text-xs text-muted-foreground">{Math.round(progressPercentage)}%</span>
    //     )}
    //   </div>

    //   <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
    //     <div
    //       className={`h-full rounded-full transition-all duration-300 ${
    //         isFull ? "bg-primary" : isAlmostFull ? "bg-primary/50" : "bg-secondary"
    //       }`}
    //       style={{ width: `${Math.min(progressPercentage, 100)}%` }}
    //     />
    //   </div>
    // </>
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
      {/* <div className="mt-2 sm:hidden">{headerDescription}</div> */}

      <DialogTitle className="hidden sm:block">{headerTitle}</DialogTitle>
      {/* <div className="mt-2 hidden sm:block">{headerDescription}</div> */}
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
          {actions}
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
        {actions}
        <div className="overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
          {registrationCount}
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}
