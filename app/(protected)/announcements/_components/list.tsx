"use client"

import { useState } from "react"
import { markAsRead, toggleRead } from "../actions"
import { Announcement } from "../types"
import AnnouncementCard from "./card"
import AnnouncementDetail from "./detail"
import AnnouncementFormModal from "./form-modal"

interface AnnouncementListProps {
  userId: string
  userRole: string
  announcements: Announcement[]
  searchQuery: string
  // loading: boolean
  // error: string | null
}

export default function AnnouncementList({
  userId,
  userRole,
  announcements,
  searchQuery,
  // loading,
  // error,
}: AnnouncementListProps) {
  const [detailOpen, setDetailOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)

  const handleAnnouncementClick = (announcement: Announcement) => async () => {
    setAnnouncement(announcement)
    setDetailOpen(true)
    // Mark as seen when opened
    await markAsRead(announcement.id, userId)
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
  const handleEditClick = async (announcementId: string) => {
    setEditOpen(true)
    setAnnouncement(
      announcements.find((announcement) => announcement.id === announcementId) || null
    )
  }

  const onToggleRead = async (announcementId: string, userId: string) => {
    await toggleRead(announcementId, userId)
  }

  return (
    <div className="space-y-6" role="list" aria-label="announcements">
      <AnnouncementDetail
        open={detailOpen}
        setOpen={setDetailOpen}
        announcement={announcement}
        userRole={userRole}
        onToggleRead={(id) => onToggleRead(id, userId)}
        onEdit={handleEditClick}
      />

      <AnnouncementFormModal announcement={announcement} open={editOpen} setOpen={setEditOpen} />

      {announcements &&
        announcements.map((announcement) => (
          <AnnouncementCard
            userRole={userRole}
            key={announcement.id}
            announcement={announcement}
            onClick={handleAnnouncementClick(announcement)}
            onEdit={handleEditClick}
            onToggleRead={() => onToggleRead(announcement.id, userId)}
            searchQuery={searchQuery}
          />
        ))}
    </div>
  )
}
