import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
// If your Prisma file is located elsewhere, you can change the path
import { prisma } from "@/prisma/client"
import { nextCookies } from "better-auth/next-js"
import { resend } from "./mail/client"

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    // requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    // sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      console.log("Sending verification email to:", user.email)

      const { data, error } = await resend.emails.send({
        from: "onboarding@updates.lennypk.dev",
        to: user.email,
        subject: "Verify your email address",
        html: `<p>Click the link to verify your email: ${url}</p>`,
      })

      console.log("Resend response data:", data, "error:", error)
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
