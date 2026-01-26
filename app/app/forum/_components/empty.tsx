"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessagesSquare } from "lucide-react"

export default function ForumEmpty() {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="flex-1 items-center justify-center py-40 text-center">
        <MessagesSquare className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h3 className="mb-2 text-lg font-semibold">No Posts Found</h3>
        <p className="text-muted-foreground">
          There are no posts to display at this time. Check back later for updates.
        </p>
      </CardContent>
    </Card>
  )
}
