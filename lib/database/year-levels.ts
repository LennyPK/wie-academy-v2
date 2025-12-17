"use server"

import { prisma } from "@/prisma/client"

export async function getYearLevels() {
  return await prisma.yearLevel.findMany({
    orderBy: { id: "asc" },
  })
}
