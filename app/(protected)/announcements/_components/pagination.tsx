"use client"

import { cn, generatePagination } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

interface PaginationProps {
  totalPages: number
}

export default function Pagination({ totalPages }: PaginationProps) {
  const pathName = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get("page")) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathName}?${params.toString()}`
  }

  const allPages = generatePagination(currentPage, totalPages)

  return (
    <div className="mt-4 flex items-center justify-between">
      <PaginationArrow
        direction="left"
        href={createPageURL(currentPage - 1)}
        isDisabled={currentPage <= 1}
      />

      <div className="flex -space-x-px">
        {allPages.map((page, index) => {
          let position: "first" | "last" | "single" | "middle" | undefined

          if (index === 0) position = "first"
          if (index === allPages.length - 1) position = "last"
          if (allPages.length === 1) position = "single"
          if (page === "...") position = "middle"

          return (
            <PaginationNumber
              key={`${page}-${index}`}
              href={createPageURL(page)}
              page={page}
              position={position}
              isActive={currentPage === page}
            />
          )
        })}
      </div>

      <PaginationArrow
        direction="right"
        href={createPageURL(currentPage + 1)}
        isDisabled={currentPage >= totalPages}
      />
    </div>
  )
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string
  href: string
  position?: "first" | "last" | "middle" | "single"
  isActive: boolean
}) {
  const className = cn(
    "flex h-10 w-10 items-center justify-center text-sm border text-primary select-none ",
    {
      "rounded-l-md": position === "first" || position === "single",
      "rounded-r-md": position === "last" || position === "single",
      "z-10 bg-primary border-primary text-primary-foreground": isActive,
      "hover:bg-primary": !isActive && position !== "middle",
      "text-gray-300": position === "middle",
    }
  )

  return isActive || position === "middle" ? (
    <div className={className}>{page}</div>
  ) : (
    <Link href={href} className={className}>
      {page}
    </Link>
  )
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string
  direction: "left" | "right"
  isDisabled?: boolean
}) {
  const className = cn(
    "flex h-10 w-10 items-center justify-center rounded-md border bg-primary text-primary-foreground",
    {
      "pointer-events-none text-secondary-foreground border-secondary bg-secondary": isDisabled,
      "hover:bg-primary/20": !isDisabled,
      "mr-2 md:mr-4": direction === "left",
      "ml-2 md:ml-4": direction === "right",
    }
  )

  const icon =
    direction === "left" ? (
      <ChevronLeft className="h-4 w-4" />
    ) : (
      <ChevronRight className="h-4 w-4" />
    )

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  )
}
