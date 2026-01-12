"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MessageSquareDashed } from "lucide-react"

export default function ForumEmptyContent() {
  return (
    <Card className="border-none bg-transparent shadow-none">
      <CardContent className="flex-1 items-center justify-center py-40 text-center">
        <MessageSquareDashed className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h3 className="mb-2 text-lg font-semibold">Select a Post</h3>
        <p className="text-muted-foreground">
          Choose a post from the list to view discussions and replies or create your own.
        </p>
      </CardContent>
    </Card>
  )
}
