"use client"

import { Announcement } from "@/announcements/types"
import AnnouncementCard from "./card"

interface AnnouncementListProps {
  userId: string
  userRole: string
  announcements: Announcement[]
  searchQuery: string
}

export default function AnnouncementList({
  userId,
  userRole,
  announcements,
  searchQuery,
}: AnnouncementListProps) {
  // const handleAnnouncementClick = (announcement: Announcement) => async () => {
  // setAnnouncement(announcement)
  // setDetailOpen(true)
  // Mark as seen when opened
  // await markAsRead(announcement.id, userId)
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
  // }

  return (
    <div className="space-y-6" role="list" aria-label="announcements">
      {announcements &&
        announcements.map((announcement) => (
          <AnnouncementCard
            userId={userId}
            userRole={userRole}
            key={announcement.id}
            announcement={announcement}
            searchQuery={searchQuery}
          />
        ))}
    </div>
  )
}
