import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: "http://localhost:3000",
  plugins: [
    inferAdditionalFields({
      user: {
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
        school: {
          type: "string",
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
    }),
  ],
})
