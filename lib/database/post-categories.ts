"use server"

import { prisma } from "@/prisma/client"

export async function getPostCategories() {
  return await prisma.postCategory.findMany({
    orderBy: { id: "asc" },
  })
}
