"use client"

import { Announcement } from "../types"
import AnnouncementCard from "./_announcement-card"

interface AnnouncementListProps {
  userRole: string
  announcements: Announcement[]
  // readAnnouncements: Set<string>
  // onToggleRead: (id: string) => Promise<void>
  // onMarkSeen: (id: string) => Promise<BadgeUpdateEvent | void>
  searchQuery: string
  // loading: boolean
  // error: string | null
}

export default function AnnouncementList({
  userRole,
  announcements,
  // readAnnouncements,
  // onToggleRead,
  // onMarkSeen,
  searchQuery,
  // loading,
  // error,
}: AnnouncementListProps) {
  // const [open, setOpen] = useState(false)
  // const [editOpen, setEditOpen] = useState(false)
  // const [announcement, setAnnouncement] = useState<AnnouncementWithMetadata | null>(null)

  // const handleAnnouncementClick = async (announcement: AnnouncementWithMetadata) => {
  //   setAnnouncement(announcement)
  //   setOpen(true)
  // Mark as seen when opened
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

  // const handleEditClick = (announcement: AnnouncementWithMetadata) => {
  //   setAnnouncement(announcement)
  //   setOpen(false)
  //   setEditOpen(true)
  // }

  return (
    <div className="space-y-6" role="list" aria-label="Announcements">
      {/* <AnnouncementModal
        open={open}
        setOpen={setOpen}
        announcement={announcement}
        // isRead={readAnnouncements.has(announcement?.id ?? "")}
        userRole={userRole}
        // onToggleRead={onToggleRead}
        onEdit={handleEditClick}
      /> */}

      {/* <AnnouncementForm
        mode="edit"
        open={editOpen}
        setOpen={setEditOpen}
        announcement={announcement}
      /> */}

      {announcements &&
        announcements.map((announcement) => (
          <AnnouncementCard
            userRole={userRole}
            key={announcement.id}
            announcement={announcement}
            // isRead={readAnnouncements.has(announcement.id)}
            // onClick={handleAnnouncementClick}
            // onEdit={handleEditClick}
            // onToggleRead={onToggleRead}
            searchQuery={searchQuery}
          />
        ))}
    </div>
  )
}
