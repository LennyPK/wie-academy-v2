"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { useDebouncedCallback } from "use-debounce"

interface ExploreFiltersProps {
  totalCount: number

  searchQuery: string
}

export default function ExploreFilters({ totalCount, searchQuery }: ExploreFiltersProps) {
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

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())

    params.delete("query")
    params.delete("page")

    setQuery("")

    router.replace(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  return (
    <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center">
        {/* Search Filter */}
        <div className="relative flex-1 text-sm sm:text-base">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-muted-foreground sm:h-5 sm:w-5" />
          <Input
            placeholder="Search quizzes..."
            className="pl-10"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              updateQuery(e.target.value)
            }}
          />
        </div>

        {/* Clear Filters */}
        <Button className="sm:ml-5" variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </div>

      {/* Results Count */}
      <div className="flex items-baseline justify-end gap-2 whitespace-nowrap">
        <div className="text-3xl font-bold text-primary">{totalCount}</div>
        <div className="text-primary">{totalCount === 1 ? "Result" : "Results"}</div>
      </div>
    </div>
  )
}
