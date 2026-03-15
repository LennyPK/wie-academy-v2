import { resend } from "./client"
import VerificationEmail from "./templates/verify-email"

export async function sendVerificationEmail(email: string, url: string) {
  return resend.emails.send({
    from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
    to: email,
    subject: "Verify your email address",
    react: VerificationEmail({ userEmail: email, verificationUrl: url }),
  })
}
