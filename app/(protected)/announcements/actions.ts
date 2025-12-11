"use server"

import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/prisma/client"
import { revalidatePath } from "next/cache"
import { NewAnnouncement } from "./types"

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
  await prisma.announcementInteraction.upsert({
    where: { announcementId_userId: { announcementId, userId } },
    update: { isRead: true },
    create: { announcementId, userId, isRead: true },
  })

  revalidatePath(ROUTES.ANNOUNCEMENTS)
}

export async function createAnnouncement(announcementInfo: NewAnnouncement) {
  const session = await auth.api.getSession()

  const announcement = await prisma.announcement.create({
    data: {
      title: announcementInfo.title,
      contentPlain: announcementInfo.contentPlain,
      contentHtml: announcementInfo.contentHtml,
      contentJson: announcementInfo.contentJson,
      categoryId: announcementInfo.categoryId,
      authorId: session?.user.id ?? undefined,
      targetSchools: {
        create: announcementInfo.schools.map((school) => ({
          school,
        })),
      },
      targetRegions: {
        create: announcementInfo.regionIds.map((regionId) => ({
          region: { connect: { id: regionId } },
        })),
      },
      targetYearLevels: {
        create: announcementInfo.yearLevelIds.map((yearLevelId) => ({
          yearLevel: { connect: { id: yearLevelId } },
        })),
      },

      include: {
        author: { include: { image: true, name: true } },
        category: true,
        targetSchools: true,
        targetRegions: { include: { region: true } },
        targetYears: { include: { yearLevel: true } },
      },
    },
  })

  return { announcement }
}
