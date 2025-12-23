"use server"

import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { NewEvent } from "./types"

export async function insertEvent(newEvent: NewEvent) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const event = await prisma.event.upsert({
    where: { id: newEvent.id },
    create: {
      title: newEvent.title,
      descriptionPlain: newEvent.descriptionPlain,
      descriptionHtml: newEvent.descriptionHtml,
      descriptionJson: newEvent.descriptionJson,
      categoryId: newEvent.categoryId,
      location: newEvent.location,
      capacity: newEvent.capacity,
      startDateTime: newEvent.startDateTime,
      endDateTime: newEvent.endDateTime,
    },
    update: {
      title: newEvent.title,
      descriptionPlain: newEvent.descriptionPlain,
      descriptionHtml: newEvent.descriptionHtml,
      descriptionJson: newEvent.descriptionJson,
      categoryId: newEvent.categoryId,
      location: newEvent.location,
      capacity: newEvent.capacity,
      startDateTime: newEvent.startDateTime,
      endDateTime: newEvent.endDateTime,
    },
  })

  return { event }
}
