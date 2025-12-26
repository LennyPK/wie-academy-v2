"use client"

import { Badge } from "@/components/ui/badge"
import { Category } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function CategoryBadge({
  category,
  className,
}: {
  category: Category
  className?: string
}) {
  // TODO: Add icons to category badges
  // const badgeCategories = [
  //   {
  //     id: AnnouncementCategory.GENERAL,
  //     name: "General",
  //     icon: Bell,
  //     // className: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100",
  //     description: "Important announcements and updates",
  //   },
  //   {
  //     id: AnnouncementCategory.WORKSHOP,
  //     name: "Workshop",
  //     icon: Wrench,
  //     // className: "bg-orange-300 text-orange-900 border-orange-300 hover:bg-orange-300",
  //     description: "Hands-on learning experiences",
  //   },
  //   {
  //     id: AnnouncementCategory.ACADEMIC_SUPPORT,
  //     name: "Academic Support",
  //     icon: BookOpen,
  //     // className: "bg-sky-300 text-sky-900 border-sky-300 hover:bg-sky-300",
  //     description: "Tutoring and educational assistance",
  //   },
  //   {
  //     id: AnnouncementCategory.COMPETITION,
  //     name: "Competition",
  //     icon: Trophy,
  //     // className: "bg-rose-300 text-rose-900 border-rose-300 hover:bg-rose-300",
  //     description: "Contests and challenges",
  //   },
  //   {
  //     id: AnnouncementCategory.SOCIAL,
  //     name: "Social",
  //     icon: Users,
  //     // className: "bg-emerald-300 text-emerald-900 border-emerald-300 hover:bg-emerald-300",
  //     description: "Community events and networking",
  //   },
  //   {
  //     id: AnnouncementCategory.SCHOOL_VISIT,
  //     name: "School Visits",
  //     icon: MapPin,
  //     // className: "bg-purple-300 text-purple-900 border-purple-300 hover:bg-purple-300",
  //     description: "Educational field trips and tours",
  //   },
  // ]
  // const Icon = badgeCategories.find((badge) => badge.id === category)?.icon as React.ElementType
  // const selectedCategory = badgeCategories.find((badge) => badge.id === category)

  return (
    <Badge
      className={cn(
        "rounded-md border bg-muted py-1 font-bold text-muted-foreground uppercase select-none",
        className
      )}
    >
      {/* {Icon && <Icon className="mr-2 h-3 w-3" />} */}
      {category.label}
    </Badge>
  )
}
