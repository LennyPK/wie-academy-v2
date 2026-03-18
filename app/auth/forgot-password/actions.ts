"use server"

import { ROUTES } from "@/constants"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma/client"
import { differenceInSeconds } from "date-fns"

const COOLDOWN_SECONDS = 60

export async function sendPasswordResetEmail(email: string) {
  const user = await prisma.user.findFirst({
    where: { email },
    select: { id: true },
  })

  if (!user) return { success: true } // don't leak whether email exists

  const recent = await prisma.verification.findFirst({
    where: {
      value: user.id,
      identifier: { startsWith: "reset-password:" },
    },
    orderBy: { createdAt: "desc" },
  })

  if (recent) {
    const elapsed = differenceInSeconds(new Date(), recent.createdAt)
    if (elapsed < COOLDOWN_SECONDS) {
      return { error: true, remainingSeconds: COOLDOWN_SECONDS - elapsed }
    }
  }

  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: ROUTES.RESET_PASSWORD,
    },
  })

  return { success: true }
}
