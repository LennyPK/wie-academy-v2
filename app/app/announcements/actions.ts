"use server"

import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/prisma/client"
import { AnnouncementInteractionType } from "@/prisma/enums"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { NewAnnouncement } from "./types"

export async function toggleRead(announcementId: string, userId: string, path: string) {
  const interaction = await prisma.announcementInteraction.findUnique({
    where: {
      announcementId_userId_type: {
        announcementId,
        userId,
        type: AnnouncementInteractionType.VIEW,
      },
    },
  })

  if (interaction) {
    await prisma.announcementInteraction.delete({
      where: {
        announcementId_userId_type: {
          announcementId,
          userId,
          type: AnnouncementInteractionType.VIEW,
        },
      },
    })
  } else {
    await prisma.announcementInteraction.create({
      data: {
        announcementId,
        userId,
        type: AnnouncementInteractionType.VIEW,
      },
    })
  }

  revalidatePath(path)
}

export async function markAsRead(announcementId: string, userId: string) {
  await prisma.announcementInteraction.upsert({
    where: {
      announcementId_userId_type: {
        announcementId,
        userId,
        type: AnnouncementInteractionType.VIEW,
      },
    },
    // update: { isRead: true },
    // create: { announcementId, userId, isRead: true },
    update: {},
    create: {
      announcementId,
      userId,
      type: AnnouncementInteractionType.VIEW,
    },
  })

  // revalidatePath(ROUTES.ANNOUNCEMENTS)
}

export async function insertAnnouncement(announcementPayload: NewAnnouncement) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const announcement = await prisma.announcement.upsert({
    where: { id: announcementPayload.id },
    create: {
      title: announcementPayload.title,
      contentPlain: announcementPayload.contentPlain,
      contentHtml: announcementPayload.contentHtml,
      contentJson: announcementPayload.contentJson,
      categoryId: announcementPayload.categoryId,
      authorId: session?.user.id ?? undefined,
      targetSchools: {
        create: announcementPayload.schoolIds.map((schoolId) => ({
          school: { connect: { id: schoolId } },
        })),
      },
      targetRegions: {
        create: announcementPayload.regionIds.map((regionId) => ({
          region: { connect: { id: regionId } },
        })),
      },
      targetYearLevels: {
        create: announcementPayload.yearLevelIds.map((yearLevelId) => ({
          yearLevel: { connect: { id: yearLevelId } },
        })),
      },
    },
    update: {
      title: announcementPayload.title,
      contentPlain: announcementPayload.contentPlain,
      contentHtml: announcementPayload.contentHtml,
      contentJson: announcementPayload.contentJson,
      categoryId: announcementPayload.categoryId,
      targetSchools: {
        deleteMany: {},
        create: announcementPayload.schoolIds.map((schoolId) => ({
          school: { connect: { id: schoolId } },
        })),
      },
      targetRegions: {
        deleteMany: {},
        create: announcementPayload.regionIds.map((regionId) => ({
          region: { connect: { id: regionId } },
        })),
      },
      targetYearLevels: {
        deleteMany: {},
        create: announcementPayload.yearLevelIds.map((yearLevelId) => ({
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

  return announcement
}
