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
import { format } from "date-fns"
import {
  Calendar,
  Clock,
  MapPinIcon,
  Pencil,
  UserRoundCheck,
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
}

export default function EventDetail({ event, open, setOpen, userRole, onEdit }: EventDetailProps) {
  const isMobile = useIsMobile()

  const isAdmin = userRole === Role.ADMIN

  const isRegistered = false

  if (!event) return null

  //  const progressPercentage = (registeredCount / event.capacity) * 100
  // const progressPercentage = (0 / event.capacity) * 100
  // const isAlmostFull = progressPercentage >= 80
  // const isFull = progressPercentage >= 100

  const handleEdit = async () => {
    onEdit(event.id)
  }

  const percentage = Math.min((0 / event.capacity) * 100, 100)
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  const getRadialColor = () => {
    if (percentage >= 100) return "#ef4444" // red
    if (percentage >= 80) return "#f97316" // orange
    return "#8b5cf6" // purple accent
  }

  const capacityGuage = (
    <div className="relative inline-flex items-center justify-center">
      <svg className="h-16 w-16 -rotate-90 transform">
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-muted/20"
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          stroke={getRadialColor()}
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute flex flex-col items-center text-sm">
        {event.capacity === 0 ? (
          <Users className="h-5 w-5" />
        ) : (
          // <div className="text-sm leading-none font-bold">{registered}</div>
          <div className="leading-none font-bold">{percentage.toFixed(0)}%</div>
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
            {/* FIXME: Button doesn't update when read status changes */}
            <Button
              variant={isRegistered ? "ghost" : "default"}
              size="icon"
              // onClick={handleToggleRead}
              className="flex-1 cursor-pointer gap-1.5"
            >
              {isRegistered ? (
                <UserRoundX className="h-4 w-4" />
              ) : (
                <UserRoundCheck className="h-4 w-4" />
              )}
              <span className="sm:inline">{isRegistered ? "Unregister" : "Register"}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{isRegistered ? "Unregister" : "Register"}</TooltipContent>
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
                <span className="sm:inline">Edit Event</span>
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
    <div className="flex items-center justify-center gap-2">
      {/* <CapacityGauge registered={0} capacity={event.capacity} /> */}
      {/* <CapacityGauge registered={10} capacity={10} /> */}
      {capacityGuage}
      {0} {event.capacity !== 0 && `/ ${event.capacity}`} registrations
    </div>
    // <>
    //   <div className="mb-2 flex items-center justify-between">
    //     <div className="flex items-center gap-2 text-sm text-muted-foreground md:text-base">
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
    <div className="mx-5 mt-5 mb-10 flex flex-col gap-4 text-sm text-muted-foreground md:text-base">
      <div className="grid grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold md:text-sm">Start</span>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(event.startDateTime, "EEEE, PP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{format(event.startDateTime, "p")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold md:text-sm">End</span>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(event.endDateTime, "EEEE, PP")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{format(event.endDateTime, "p")}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold md:text-sm">Location</span>
        <div className="flex items-center gap-2">
          <MapPinIcon className="h-4 w-4" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  )

  const header = (
    <div>
      <div className="mb-4 flex justify-center md:justify-start">
        <CategoryBadge category={event.category} className="w-fit" />
      </div>
      <DrawerTitle className="md:hidden">{headerTitle}</DrawerTitle>
      {/* <div className="mt-2 md:hidden">{headerDescription}</div> */}

      <DialogTitle className="hidden md:block">{headerTitle}</DialogTitle>
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
        <DrawerContent className="bg-card">
          <DrawerHeader className="text-center">{header}</DrawerHeader>
          <div className="px-5">
            {actions}
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
        className="no-scrollbar flex max-h-[85vh] min-h-[200px] w-full max-w-[800px] min-w-[320px] flex-col overflow-hidden bg-card sm:max-w-[960px]"
      >
        <DialogHeader>{header}</DialogHeader>
        {actions}
        {registrationCount}
        {content}
      </DialogContent>
    </Dialog>
  )
}
