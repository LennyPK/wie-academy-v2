"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { registerForEvent } from "../actions"
import { Event } from "../types"
import EventCard from "./card"
import EventDetail from "./detail"
import EventFormModal from "./form-modal"

interface EventListProps {
  userId: string
  userRole: string
  events: Event[]
  searchQuery: string
  // loading: boolean
  // error: string | null
}

export default function EventList({
  userId,
  userRole,
  events,
  searchQuery,
  // loading,
  // error,
}: EventListProps) {
  const router = useRouter()
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)

  const handleEventClick = (event: Event) => async () => {
    setEvent(event)
    setDetailOpen(true)
    // const seen = await onMarkSeen(announcement.id)
    // if (seen && (seen.event === "unlocked" || seen.event === "tier_up")) {
    //   const supabase = createClient()
    //   const {
    //     data: { user },
    //   } = await supabase.auth.getUser()
    //   const userId = user?.id
    //   if (!userId) return
    //   const gained = XP_VALUES.NEW_BADGE_TIER
    //   const xpAddSuccess = await addXPToUser(userId, gained)
    //   const name = seen.badgeName || "Badge"
    //   const msg =
    //     seen.event === "unlocked"
    //       ? `${name} unlocked!`
    //       : `${name} upgraded to Tier ${seen.newTier}!`
    //   toast.success(msg, xpAddSuccess ? { description: `Gained ${gained} XP!` } : {})
    // }
  }

  // const handleEditClick = (announcement: AnnouncementWithMetadata) => {
  //   setAnnouncement(announcement)
  //   setOpen(false)
  //   setEditOpen(true)
  // }
  const handleEditClick = async (eventId: string) => {
    setEditOpen(true)
    setEvent(events.find((event) => event.id === eventId) || null)
  }

  const handleRegisterClick = async (eventId: string, capacity: number) => {
    await registerForEvent(eventId, userId, capacity)

    router.refresh()
  }

  // const isRegistered = events.find()

  return (
    <div
      // className={cn("space-y-6", events.length && "grid-cols-2 sm:grid")}
      className="grid gap-5 sm:grid-cols-2"
      role="list"
      aria-label="events"
    >
      {event && (
        <EventDetail
          open={detailOpen}
          setOpen={setDetailOpen}
          event={event}
          userRole={userRole}
          onEdit={handleEditClick}
          onRegister={() => handleRegisterClick(event.id, event.capacity)}
          isRegistered={event.registrations.length > 0}
          isAttended={event.participations.length > 0}
        />
      )}

      <EventFormModal event={event} open={editOpen} setOpen={setEditOpen} />

      {events &&
        events.map((event) => (
          <EventCard
            userRole={userRole}
            key={event.id}
            event={event}
            searchQuery={searchQuery}
            onClick={handleEventClick(event)}
            onEdit={handleEditClick}
            onRegister={() => handleRegisterClick(event.id, event.capacity)}
            isRegistered={event.registrations.length > 0}
            isAttended={event.participations.length > 0}
          />
        ))}
    </div>
  )
}
