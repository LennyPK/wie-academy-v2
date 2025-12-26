"use server"

import { prisma } from "@/prisma/client"

export async function getEventCategories() {
  return await prisma.eventCategory.findMany({
    orderBy: { id: "asc" },
  })
}
