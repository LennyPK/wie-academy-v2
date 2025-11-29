"use server"

import { prisma } from "@/prisma"

export async function getRegions() {
  return await prisma.region.findMany({
    orderBy: { label: "asc" },
  })
}
