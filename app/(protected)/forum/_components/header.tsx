"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ForumHeader() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleCreateClick = () => {
    const params = new URLSearchParams(searchParams.toString())

    params.set("mode", "create")
    params.delete("postId")

    router.push(`?${params.toString()}`)
  }

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Forum</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect, share, and learn with your peers
            </p>
          </div>
          <Button className="gap-2" onClick={handleCreateClick}>
            <Plus />
            <span className="hidden sm:inline">New Post</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </header>
    </>
  )
}
