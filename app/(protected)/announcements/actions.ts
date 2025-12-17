"use server"

import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/prisma/client"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
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
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const announcement = await prisma.announcement.upsert({
    where: { id: announcementInfo.id },
    create: {
      title: announcementInfo.title,
      contentPlain: announcementInfo.contentPlain,
      contentHtml: announcementInfo.contentHtml,
      contentJson: announcementInfo.contentJson,
      categoryId: announcementInfo.categoryId,
      authorId: session?.user.id ?? undefined,
      targetSchools: {
        create: announcementInfo.schoolIds.map((schoolId) => ({
          school: { connect: { id: schoolId } },
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
    },
    update: {
      title: announcementInfo.title,
      contentPlain: announcementInfo.contentPlain,
      contentHtml: announcementInfo.contentHtml,
      contentJson: announcementInfo.contentJson,
      categoryId: announcementInfo.categoryId,
      targetSchools: {
        deleteMany: {},
        create: announcementInfo.schoolIds.map((schoolId) => ({
          school: { connect: { id: schoolId } },
        })),
      },
      targetRegions: {
        deleteMany: {},
        create: announcementInfo.regionIds.map((regionId) => ({
          region: { connect: { id: regionId } },
        })),
      },
      targetYearLevels: {
        deleteMany: {},
        create: announcementInfo.yearLevelIds.map((yearLevelId) => ({
          yearLevel: { connect: { id: yearLevelId } },
        })),
      },
    },
    include: {
      author: { select: { name: true, image: true } },
      category: true,
      targetSchools: { include: { school: true } },
      targetRegions: { include: { region: true } },
      targetYearLevels: { include: { yearLevel: true } },
    },
  })

  return { announcement }
}
