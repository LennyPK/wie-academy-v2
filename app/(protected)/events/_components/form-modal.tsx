"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { Event } from "../types"
import EventForm from "./form"

interface EventFormModalProps {
  event?: Event | null
  open: boolean
  setOpen: (open: boolean) => void
}

export default function EventFormModal({ event, open, setOpen }: EventFormModalProps) {
  const isMobile = useIsMobile()

  const modalTitle = <span>{event ? "Edit Event" : "Create Event"}</span>

  const modalContent = (
    <div className="no-scrollbar overflow-y-auto">
      <EventForm event={event} setOpen={setOpen} />
    </div>
  )

  if (isMobile) {
    return (
      <Drawer repositionInputs={false} open={open} onOpenChange={setOpen}>
        <DrawerOverlay className="backdrop-blur-xs" />
        <DrawerContent className="bg-card">
          <DrawerHeader className="text-center">
            <DrawerTitle>{modalTitle}</DrawerTitle>
          </DrawerHeader>
          {modalContent}
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogOverlay className="backdrop-blur-xs" />
      <DialogContent className="flex max-h-[85vh] min-h-[200px] w-full max-w-[800px] min-w-[320px] flex-col overflow-hidden bg-card sm:max-w-[960px]">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        {modalContent}
      </DialogContent>
    </Dialog>
  )
}
