"use client"

import { Button } from "@/components/ui/button"
import { Role } from "@/prisma/enums"
import { Plus } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"

interface AnnouncementHeaderProps {
  userRole: Role
}

export default function AnnouncementHeader({ userRole }: AnnouncementHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleCreateClick = () => {
    router.push(`${pathname}/create`)
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Announcements</h1>
          <p className="mt-1 text-sm text-muted-foreground">Stay updated with the latest news.</p>
        </div>
        {userRole === Role.ADMIN && (
          <Button className="gap-2" onClick={handleCreateClick}>
            <Plus />
            <span className="hidden sm:inline">Create Announcement</span>
            <span className="sm:hidden">Create</span>
          </Button>
        )}
      </div>
    </header>
  )
}
