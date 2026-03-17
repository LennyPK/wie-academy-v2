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

interface VerificationEmailProps {
  userEmail: string
  verificationUrl: string
  appName?: string
}

export default function VerificationEmail({
  userEmail,
  verificationUrl,
  appName = "WiE Academy",
}: VerificationEmailProps) {
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
        <Preview>Verify your email address to complete your account setup</Preview>
        <Body className="bg-background py-10 font-sans">
          <Card>
            <CardHeader>
              <Heading style={style.heading}>Verify Your Email Address</Heading>
            </CardHeader>

            {/* Main Content */}
            <CardContent>
              <Section>
                <Text style={style.body}>Hi there,</Text>
                <Text style={style.body}>
                  Thanks for signing up with {appName}! To complete your account setup and ensure
                  the security of your account, please verify your email address by clicking the
                  button below.
                </Text>
              </Section>

              {/* CTA Button */}
              <Section className="py-5 text-center">
                <Button href={verificationUrl} style={style.button}>
                  Verify Email Address
                </Button>
              </Section>

              {/* Alternative Link */}
              <Section>
                <Text style={{ ...style.body, marginBottom: "0" }}>
                  If the button doesn&apos;t work, copy and paste this link into your browser:
                </Text>
                <Link href={verificationUrl} style={style.link}>
                  {verificationUrl}
                </Link>
              </Section>

              <Separator />

              {/* Security Notice */}
              <Section>
                <Text style={style.muted}>• This verification link will expire in 1 hour</Text>
                <Text style={style.muted}>
                  • If you didn&apos;t create an account, you can safely ignore this email
                </Text>
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

VerificationEmail.PreviewProps = {
  userEmail: "user@example.com",
  verificationUrl: "https://localhost:3000",
  appName: "WiE Academy",
}
