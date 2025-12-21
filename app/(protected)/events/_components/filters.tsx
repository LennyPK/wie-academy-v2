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

interface EventFiltersProps {
  categories: { id: number; label: string }[]

  searchQuery: string
  status: string
  category: string
  sorting: string
  totalCount: number
}

export default function EventFilters({
  categories,

  searchQuery,
  status,
  category,
  sorting,
  totalCount,
}: EventFiltersProps) {
  const router = useRouter()
  const pathName = usePathname()
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

    router.replace(`${pathName}?${params.toString()}`)
  }, 500)

  const updateStatus = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value !== "upcoming") {
        params.set("status", value)
      } else {
        params.delete("status")
      }

      // Reset pagination when filters change
      params.delete("page")

      router.replace(`${pathName}?${params.toString()}`)
    },
    [searchParams, router, pathName]
  )

  const updateCategory = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value !== "all") {
        params.set("category", value)
      } else {
        params.delete("category")
      }

      // Reset pagination when filters change
      params.delete("page")

      router.replace(`${pathName}?${params.toString()}`)
    },
    [searchParams, router, pathName]
  )

  const updateSorting = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())

      if (value !== "date_desc") {
        params.set("sorting", value)
      } else {
        params.delete("sorting")
      }

      // Reset pagination when filters change
      params.delete("page")

      router.replace(`${pathName}?${params.toString()}`)
    },
    [searchParams, router, pathName]
  )

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams()
    params.delete("query")
    params.delete("status")
    params.delete("category")
    params.delete("sorting")
    params.delete("page")
    setQuery("")
    router.replace(`${pathName}?${params.toString()}`)
  }, [router, pathName])

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex-1 space-y-2">
        {/* Search Filter */}
        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              updateQuery(e.target.value)
            }}
          />
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          {/* Status Filter */}
          <Select value={status} onValueChange={updateStatus}>
            <SelectTrigger className="w-full md:flex-1">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={category} onValueChange={updateCategory}>
            <SelectTrigger className="w-full md:flex-1">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sorting Filter */}
          <Select value={sorting} onValueChange={updateSorting}>
            <SelectTrigger className="w-full md:flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date_desc">Newest first</SelectItem>
              <SelectItem value="date_asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          <Button className="md:ml-5" variant="outline" onClick={clearFilters}>
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
