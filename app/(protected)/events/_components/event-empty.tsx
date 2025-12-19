"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar1 } from "lucide-react"

export default function EventEmpty() {
  return (
    <Card
      tabIndex={0}
      role="article"
      aria-labelledby={"event-empty-card"}
      className="border-none bg-transparent shadow-none"
    >
      <CardContent className="flex-1 items-center justify-center py-20 text-center">
        <Calendar1 className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h3 className="mb-2 text-lg font-semibold">No Events Found</h3>
        <p className="text-muted-foreground">
          There are no events to display at this time. Check back later for updates.
        </p>
      </CardContent>
    </Card>
  )
}
