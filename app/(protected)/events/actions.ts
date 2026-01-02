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

  return event
}

export async function registerForEvent(eventId: string, userId: string, capacity: number) {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.eventRegistration.findUnique({
      where: { userId_eventId: { userId, eventId } },
    })

    // Already registered
    if (existing) {
      await tx.eventRegistration.delete({
        where: { userId_eventId: { userId, eventId } },
      })

      return { status: "unregistered" as const }
    }

    // Not registered - check capacity
    if (capacity !== 0) {
      const registrationCount = await prisma.eventRegistration.count({ where: { eventId } })

      if (registrationCount >= capacity) {
        throw new Error("Event is full")
      }
    }

    // Register
    await tx.eventRegistration.create({ data: { userId, eventId } })

    return { status: "registered" as const }
  })
}
