"use server"

import { prisma } from "@/prisma/client"

export async function getSchools() {
  return await prisma.school.findMany({
    orderBy: { label: "asc" },
  })
}
