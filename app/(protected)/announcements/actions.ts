"use server"

import { ROUTES } from "@/lib/constants"
import { prisma } from "@/prisma/client"
import { revalidatePath } from "next/cache"

export async function toggleRead(announcementId: string, userId: string) {
  const interaction = await prisma.announcementInteraction.findUnique({
    where: {
      announcementId_userId: {
        announcementId,
        userId,
      },
    },
  })

  if (interaction) {
    // Toggle the current value
    await prisma.announcementInteraction.update({
      where: {
        announcementId_userId: {
          announcementId,
          userId,
        },
      },
      data: {
        isRead: !interaction.isRead,
      },
    })
  } else {
    // If no interaction exists yet, create it as read
    await prisma.announcementInteraction.create({
      data: {
        announcementId,
        userId,
        isRead: true,
      },
    })
  }

  revalidatePath(ROUTES.ANNOUNCEMENTS)
}

export async function markAsRead(announcementId: string, userId: string) {
  await prisma.announcementInteraction
    .upsert({
      where: { announcementId_userId: { announcementId, userId } },
      update: { isRead: true },
      create: { announcementId, userId, isRead: true },
    })
    .then(revalidatePath(ROUTES.ANNOUNCEMENTS))
  // const interaction = await prisma.announcementInteraction.findUnique({
  //   where: {
  //     announcementId_userId: {
  //       announcementId,
  //       userId,
  //     },
  //   },
  // })

  // if (interaction) {
  //   // Toggle the current value
  //   await prisma.announcementInteraction.update({
  //     where: {
  //       announcementId_userId: {
  //         announcementId,
  //         userId,
  //       },
  //     },
  //     data: {
  //       isRead: true,
  //     },
  //   })
  // } else {
  //   // If no interaction exists yet, create it as read
  //   await prisma.announcementInteraction.create({
  //     data: {
  //       announcementId,
  //       userId,
  //       isRead: true,
  //     },
  //   })
  // }

  // revalidatePath(ROUTES.ANNOUNCEMENTS)
}
