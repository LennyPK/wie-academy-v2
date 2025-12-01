"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Filter, Plus, Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import AnnouncementForm from "./_announcement-form"

interface FiltersProps {
  userRole: string
  search: string
  readStatus: string
  dateRange: string
  totalCount: number
}

export default function Filters({
  userRole,
  search,
  readStatus,
  dateRange,
  totalCount,
}: FiltersProps) {
  const router = useRouter()
  const pathName = usePathname()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(search)

  const updateSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value.trim()) {
      params.set("search", value)
    } else {
      params.delete("search")
    }

    // Reset pagination when filters change
    params.delete("page")

    router.replace(`${pathName}?${params.toString()}`)
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

      router.replace(`${pathName}?${params.toString()}`)
    },
    [searchParams, router, pathName]
  )

  const updateDateRange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value !== "month") {
        params.set("dateRange", value)
      } else {
        params.delete("dateRange")
      }

      // Reset pagination when filters change
      params.delete("page")

      router.replace(`${pathName}?${params.toString()}`)
    },
    [searchParams, router, pathName]
  )

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams()
    params.delete("search")
    params.delete("readStatus")
    params.delete("dateRange")
    params.delete("page")
    setSearchValue("")
    router.replace(`${pathName}?${params.toString()}`)
  }, [router, pathName])

  return (
    <>
      <Card className="mb-8 border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between space-x-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filter & Search</span>
            </div>
            <Button onClick={() => setOpen(true)} hidden={userRole === "member"}>
              <Plus className="h-4 w-4" />
              <span className="md:hidden">New</span>
              <span className="hidden md:inline">Create Announcement</span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Left side - Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap md:shrink-0 lg:flex-nowrap">
              {/* Search Bar*/}
              <div className="relative">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                <Input
                  placeholder="Search announcements..."
                  className="pl-10"
                  value={searchValue}
                  onChange={(e) => {
                    const value = e.target.value
                    setSearchValue(value)
                    updateSearch(value)
                  }}
                />
              </div>

              {/* Read Status Filter */}
              <Select value={readStatus} onValueChange={updateReadStatus}>
                <SelectTrigger className="w-full md:w-50">
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
                <SelectTrigger className="w-full md:w-50">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>

            {/* Right side - Results Display */}
            <div className="flex flex-1 items-baseline justify-end gap-2 md:ml-6">
              <div className="text-3xl font-bold text-primary">{totalCount}</div>
              <div className="text-primary">{totalCount === 1 ? "Result" : "Results"}</div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AnnouncementForm mode="create" open={open} setOpen={setOpen} />
    </>
  )
}
