// console.log("RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)

// import "dotenv/config"
import { Resend } from "resend"

export const resend = new Resend(process.env.RESEND_API_KEY)

// resend.emails.send({
//   from: "onboarding@resend.dev",
//   to: "email@example.com",
//   subject: "Hello World",
//   html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
// })
