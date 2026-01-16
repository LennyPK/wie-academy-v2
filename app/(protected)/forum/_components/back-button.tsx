"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function BackButton() {
  const router = useRouter()

  const handleClick = () => {
    router.back()
  }

  return (
    <div className="py-4">
      <Button variant="ghost" className="text-sm text-muted-foreground" onClick={handleClick}>
        <ChevronLeft className="size-5" />
        <span>Back</span>
      </Button>
    </div>
  )
}
