"use client"

import { Button } from "@/components/ui/button"
import { Role } from "@/prisma/enums"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface EventHeaderProps {
  userRole: Role
}

export function EventHeader({ userRole }: EventHeaderProps) {
  const [open, setOpen] = useState(false)

  const handleModalClick = () => {
    setOpen(true)
  }

  // TODO: Remove after implementing form
  useEffect(() => {
    toast.success(`Form button clicked: ${open}`)
  })

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Events</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore upcoming events and get involved in what&apos;s happening around you.
            </p>
          </div>
          {userRole === Role.ADMIN && (
            <Button className="gap-2" onClick={handleModalClick}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Event</span>
              <span className="sm:hidden">Create</span>
            </Button>
          )}
        </div>
      </header>

      {/* <EventForm open={open} setOpen={setOpen} /> */}
    </>
  )
}
