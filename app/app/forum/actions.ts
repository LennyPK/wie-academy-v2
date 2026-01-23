"use server"

import { auth } from "@/lib/auth"
import { ROUTES } from "@/lib/constants"
import { prisma } from "@/lib/prisma/client"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { NewPost } from "./types"

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
