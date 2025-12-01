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
import { Announcement } from "../types"
import CreateDialog from "./_create-dialog"

interface AnnouncementFormProps {
  mode: "create" | "edit"
  announcement?: Announcement | null
  open: boolean
  setOpen: (open: boolean) => void
}

export default function AnnouncementForm({
  mode,
  announcement,
  open,
  setOpen,
}: AnnouncementFormProps) {
  const isDesktop = !useIsMobile()

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogOverlay className="backdrop-blur-xs" />
          <DialogContent className="flex max-h-[85vh] min-h-[200px] w-full max-w-[800px] min-w-[320px] flex-col overflow-hidden sm:max-w-[960px]">
            <DialogHeader>
              <DialogTitle>
                <ModalTitle mode={mode} />
              </DialogTitle>
            </DialogHeader>
            <ModalContent mode={mode} setOpen={setOpen} announcement={announcement} />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer repositionInputs={false} open={open} onOpenChange={setOpen}>
          <DrawerOverlay className="backdrop-blur-xs" />
          <DrawerContent>
            <DrawerHeader className="text-center">
              <DrawerTitle>
                <ModalTitle mode={mode} />
              </DrawerTitle>
            </DrawerHeader>
            <ModalContent mode={mode} setOpen={setOpen} announcement={announcement} />
          </DrawerContent>
        </Drawer>
      )}
    </>
  )
}

function ModalTitle({ mode }: { mode: "create" | "edit" }) {
  return <>{mode === "create" ? "Create Announcement" : "Edit Announcement"}</>
}

function ModalContent({
  // mode,
  // announcement,
  setOpen,
}: {
  mode: "create" | "edit"
  announcement?: Announcement | null
  setOpen: (open: boolean) => void
}) {
  return (
    <div className="no-scrollbar overflow-y-auto">
      {/* {mode === "create" ? (
        <CreateDialog setOpen={setOpen} />
      ) : (
        <EditDialog announcement={announcement!} setOpen={setOpen} />
      )} */}
      <CreateDialog setOpen={setOpen} />
    </div>
  )
}
