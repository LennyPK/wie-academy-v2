import { ReactNode } from "react"

/**
 * Highlights search query matches in text with styled mark tags
 * @param text The text to search in
 * @param query The search query to highlight
 * @returns React elements with highlighted matches
 */
export function highlightText(text: string, query: string): ReactNode {
  if (!query?.trim()) return text

  // Escape special characters in the query
  const safeQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

  // Split into matches and non-matches
  const parts = text.split(new RegExp(`(${safeQuery})`, "gi"))

  const trimmedQuery = query.trim().toLowerCase()
  return parts.map((part, i) =>
    part.toLowerCase() === trimmedQuery ? (
      <mark
        key={i}
        className="rounded bg-purple-100 px-0.5 text-purple-900 dark:bg-purple-900/20 dark:text-purple-200"
      >
        {part}
      </mark>
    ) : (
      part
    )
  )
}
