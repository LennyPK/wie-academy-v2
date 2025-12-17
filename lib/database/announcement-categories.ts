"use server"

import { prisma } from "@/prisma/client"

export async function getAnnouncementCategories() {
  return await prisma.announcementCategory.findMany({
    orderBy: { id: "asc" },
  })
}
