import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "@/prisma/client"
import { nextCookies } from "better-auth/next-js"
import { after } from "next/server"
import { sendPasswordResetEmail, sendVerificationEmail } from "./mail/send"

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000", "http://192.168.20.201:3000"],
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      after(() => sendPasswordResetEmail(user.email, url))
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      after(() => sendVerificationEmail(user.email, url))
    },
    expiresIn: 3600, // 1 hour
  },
  plugins: [nextCookies()],
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
      },
      lastName: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: false,
        defaultValue: "MEMBER",
        input: false,
      },
      approvalStatus: {
        type: "string",
        required: false,
        defaultValue: "PENDING",
        input: false,
      },
      birthDate: {
        type: "date",
        required: true,
      },
      schoolId: {
        type: "number",
        required: true,
      },
      regionId: {
        type: "number",
        required: true,
      },
      yearId: {
        type: "number",
        required: true,
      },
    },
    deleteUser: {
      enabled: true,
    },
  },
})
