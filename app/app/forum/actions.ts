"use server"

import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { PostInteractionType } from "@/prisma/enums"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { NewPost, NewReply } from "./types"

export async function insertPost(postPayload: NewPost) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const post = await prisma.post.upsert({
    where: { id: postPayload.id },
    create: {
      title: postPayload.title,
      contentPlain: postPayload.contentPlain,
      contentHtml: postPayload.contentHtml,
      contentJson: postPayload.contentJson,
      isAnonymous: postPayload.isAnonymous,
      isPrivate: postPayload.isPrivate,
      categoryId: postPayload.categoryId,
      authorId: session?.user.id ?? undefined,
    },
    update: {
      title: postPayload.title,
      contentPlain: postPayload.contentPlain,
      contentHtml: postPayload.contentHtml,
      contentJson: postPayload.contentJson,
      isAnonymous: postPayload.isAnonymous,
      isPrivate: postPayload.isPrivate,
      categoryId: postPayload.categoryId,
    },
    include: {
      author: { select: { name: true, image: true } },
      category: true,
    },
  })

  return post
}

export async function insertReply(replyPayload: NewReply) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect(ROUTES.UNAUTHENTICATED_ERROR)
  }

  const reply = await prisma.postReply.upsert({
    where: { id: replyPayload.id },
    create: {
      postId: replyPayload.postId,
      contentPlain: replyPayload.contentPlain,
      contentHtml: replyPayload.contentHtml,
      contentJson: replyPayload.contentJson,
      isAnonymous: replyPayload.isAnonymous,
      authorId: session?.user.id ?? undefined,
    },
    update: {
      contentPlain: replyPayload.contentPlain,
      contentHtml: replyPayload.contentHtml,
      contentJson: replyPayload.contentJson,
      isAnonymous: replyPayload.isAnonymous,
    },
  })

  return reply
}

export async function markAsRead(postId: string, userId: string) {
  await prisma.postInteraction.upsert({
    where: {
      postId_userId_type: {
        postId,
        userId,
        type: PostInteractionType.VIEW,
      },
    },
    update: {},
    create: {
      postId,
      userId,
      type: PostInteractionType.VIEW,
    },
  })
}

export async function toggleLike(postId: string, userId: string, path: string) {
  const interaction = await prisma.postInteraction.findUnique({
    where: {
      postId_userId_type: {
        postId,
        userId,
        type: PostInteractionType.LIKE,
      },
    },
  })

  if (interaction) {
    await prisma.postInteraction.delete({
      where: {
        postId_userId_type: {
          postId,
          userId,
          type: PostInteractionType.LIKE,
        },
      },
    })
  } else {
    await prisma.postInteraction.create({
      data: {
        postId,
        userId,
        type: PostInteractionType.LIKE,
      },
    })
  }

  revalidatePath(path)
}
