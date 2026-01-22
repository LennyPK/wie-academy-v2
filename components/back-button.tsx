"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  label?: string
  route?: string
}

export default function BackButton({ label, route }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (route) {
      router.push(route)
    } else {
      router.back()
    }
  }

  return (
    <div className="py-4">
      <Button variant="ghost" className="text-sm text-muted-foreground" onClick={handleClick}>
        <ChevronLeft className="size-5" />
        <span>{label ? label : "Back"}</span>
      </Button>
    </div>
  )
}
