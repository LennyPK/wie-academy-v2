"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Megaphone } from "lucide-react"

export default function AnnouncementEmpty() {
  return (
    <Card
      tabIndex={0}
      role="article"
      aria-labelledby={"announcement-empty-card"}
      className="border-none bg-transparent shadow-none"
    >
      <CardContent className="flex-1 items-center justify-center py-20 text-center">
        <Megaphone className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h3 className="mb-2 text-lg font-semibold">No Announcements Found</h3>
        <p className="text-muted-foreground">
          There are no announcements to display at this time. Check back later for updates.
        </p>
      </CardContent>
    </Card>
  )
}
