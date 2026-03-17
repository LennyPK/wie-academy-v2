import { resend } from "./client"
import PasswordResetEmail from "./templates/forgot-password"
import VerificationEmail from "./templates/verify-email"

export async function sendVerificationEmail(email: string, url: string) {
  return resend.emails.send({
    from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
    to: email,
    subject: "Verify your email address",
    react: VerificationEmail({ userEmail: email, verificationUrl: url }),
  })
}

export async function sendPasswordResetEmail(email: string, url: string) {
  return resend.emails.send({
    from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
    to: email,
    subject: "Reset your password",
    react: PasswordResetEmail({ userEmail: email, resetUrl: url }),
  })
}
