import {
  Body,
  Button,
  Head,
  Heading,
  Html,
  Link,
  pixelBasedPreset,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"
import { colors, style } from "./theme"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Separator } from "./ui/separator"

interface PasswordResetEmailProps {
  userEmail: string
  resetUrl: string
  appName?: string
}

export default function PasswordResetEmail({
  userEmail,
  resetUrl,
  appName = "WiE Academy",
}: PasswordResetEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          theme: {
            extend: {
              colors: colors,
            },
          },
        }}
      >
        <Head />
        <Preview>Reset your password - secure link inside</Preview>
        <Body className="bg-background py-10 font-sans">
          <Card>
            <CardHeader>
              <Heading style={style.heading}>Password Reset Request</Heading>
            </CardHeader>

            <CardContent>
              <Section>
                <Text style={style.body}>Hi,</Text>
                <Text style={style.body}>
                  We received a request to reset the password for your {appName} account associated
                  with {userEmail}.
                </Text>
                <Text style={style.body}>
                  If you made this request, click the button below to reset your password. If you
                  didn&apos;t request a password reset, you can safely ignore this email.
                </Text>
              </Section>

              {/* CTA Button */}
              <Section className="py-5 text-center">
                <Button href={resetUrl} style={style.button}>
                  Reset My Password
                </Button>
              </Section>

              {/* Alternative Link */}
              <Section>
                <Text style={{ ...style.body, marginBottom: "0" }}>
                  If the button doesn&apos;t work, copy and paste this link into your browser:
                </Text>
                <Link href={resetUrl} style={style.link}>
                  {resetUrl}
                </Link>
              </Section>

              <Separator />

              {/* Security Notice */}
              <Section>
                <Text style={{ ...style.muted, marginBottom: "0" }}>
                  This reset link expires in 1 hour for your security
                </Text>
              </Section>

              <Separator />

              {/* Didn't Request Section */}
              <Section>
                <Text style={style.body} className="mt-0 font-semibold">
                  Didn&apos;t request this reset?
                </Text>
                <Text style={style.body}>
                  If you didn&apos;t request a password reset, your account may be at risk. Please:
                </Text>
                <Text style={{ ...style.body, lineHeight: "12px" }}>
                  • Change your password immediately by logging into your account
                </Text>
                <Text style={{ ...style.body, lineHeight: "12px" }}>
                  • Review your recent account activity
                </Text>
                <Text style={{ ...style.body, lineHeight: "12px" }}>
                  • Contact our support team if you notice any suspicious activity
                </Text>
              </Section>

              {/* Support Section */}
              <Section className="my-5 text-center">
                <Text style={{ ...style.muted, fontSize: "14px", marginBottom: "4px" }}>
                  Need help? Contact our support team:
                </Text>
                <Link href={`mailto:${process.env.EMAIL_SUPPORT_ADDRESS}`} style={style.link}>
                  support@company.com
                </Link>
              </Section>
            </CardContent>

            <CardFooter>
              <Text style={{ ...style.muted, fontSize: "12px" }}>
                This email was sent to {userEmail}
              </Text>
            </CardFooter>
          </Card>
        </Body>
      </Tailwind>
    </Html>
  )
}

PasswordResetEmail.PreviewProps = {
  userEmail: "user@example.com",
  userName: "John Doe",
  resetUrl: "https://yourapp.com/reset-password?token=abc123xyz789",
  appName: "Your Company",
  requestTime: "March 14, 2026 at 6:00 PM NZDT",
  userAgent: "Chrome 122.0.0.0 on macOS",
}
