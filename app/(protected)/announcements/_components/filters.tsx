"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

interface AnnouncementFiltersProps {
  totalCount: number

  searchQuery: string
  readStatus: string
  dateRange: string
}

export default function AnnouncementFilters({
  totalCount,

  searchQuery,
  readStatus,
  dateRange,
}: AnnouncementFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchQuery)

  const updateQuery = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value.trim()) {
      params.set("query", value)
    } else {
      params.delete("query")
    }

    // Reset pagination when filters change
    params.delete("page")

    router.replace(`${pathname}?${params.toString()}`)
  }, 500)

  const updateReadStatus = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value !== "all") {
        params.set("readStatus", value)
      } else {
        params.delete("readStatus")
      }

      // Reset pagination when filters change
      params.delete("page")

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

  const updateDateRange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value !== "30_days") {
        params.set("dateRange", value)
      } else {
        params.delete("dateRange")
      }

      // Reset pagination when filters change
      params.delete("page")

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("query")
    params.delete("readStatus")
    params.delete("dateRange")
    params.delete("page")

    setQuery("")

    router.replace(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 space-y-2">
        {/* Search Filter */}
        <div className="relative text-sm sm:text-base">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground sm:h-5 sm:w-5" />
          <Input
            placeholder="Search announcements..."
            className="pl-10"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              updateQuery(e.target.value)
            }}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Read Status Filter */}
          <Select value={readStatus} onValueChange={updateReadStatus}>
            <SelectTrigger className="w-full sm:flex-1">
              <SelectValue placeholder="Read Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Announcements</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <SelectItem value="read">Read Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Filter */}
          <Select value={dateRange} onValueChange={updateDateRange}>
            <SelectTrigger className="w-full sm:flex-1">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="30_days">Last 30 Days</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          <Button className="sm:ml-5" variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-baseline justify-end gap-2 whitespace-nowrap">
        <div className="text-3xl font-bold text-primary">{totalCount}</div>
        <div className="text-primary">{totalCount === 1 ? "Result" : "Results"}</div>
      </div>
    </div>
  )
}
