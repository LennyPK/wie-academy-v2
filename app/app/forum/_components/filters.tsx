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

interface ForumFilterProps {
  categories: { id: number; label: string }[]
  totalCount: number

  searchQuery: string
  category: string
}

export default function ForumFilters({
  categories,
  totalCount,

  searchQuery,
  category,
}: ForumFilterProps) {
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

      router.replace(`${pathname}?${params.toString()}`)
    },
    [searchParams, router, pathname]
  )

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("query")
    params.delete("category")
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
            placeholder="Search posts..."
            className="pl-10"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              updateQuery(e.target.value)
            }}
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Category Filter */}
          <Select value={category} onValueChange={updateCategory}>
            <SelectTrigger className="w-full sm:flex-1">
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
