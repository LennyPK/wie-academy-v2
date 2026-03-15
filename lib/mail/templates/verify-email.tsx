import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

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
      <Tailwind>
        <Head />
        <Preview>Verify your email address to complete your account setup</Preview>
        <Body className="bg-background py-10 font-sans">
          <Container className="mx-auto max-w-150 rounded-xl bg-card p-8">
            {/* Header */}
            <Section className="mb-8 text-center">
              <Heading className="text-foregound m-0 text-[24px] font-bold">
                Verify Your Email Address
              </Heading>
            </Section>

            {/* Main Content */}
            <Section className="mb-8">
              <Text className="mb-4 text-[16px] leading-6 text-card-foreground">Hi there,</Text>
              <Text className="mb-4 text-[16px] leading-6 text-card-foreground">
                Thanks for signing up with {appName}! To complete your account setup and ensure the
                security of your account, please verify your email address by clicking the button
                below.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section className="mb-8 text-center">
              <Button
                href={verificationUrl}
                className="box-border inline-block rounded-xl bg-primary px-8 py-4 text-[16px] font-semibold text-primary-foreground no-underline"
              >
                Verify Email Address
              </Button>
            </Section>

            {/* Alternative Link */}
            <Section className="mb-8">
              <Text className="mb-2 text-[14px] leading-5 text-card-foreground">
                If the button doesn&apos;t work, copy and paste this link into your browser:
              </Text>
              <Link href={verificationUrl} className="text-[14px] break-all text-primary">
                {verificationUrl}
              </Link>
            </Section>

            {/* Security Notice */}
            <Section className="mb-8 border-t border-muted pt-6">
              <Text className="mb-2 text-[14px] leading-5 text-muted-foreground">
                <strong>Security Notice:</strong>
              </Text>
              <Text className="mb-2 text-[14px] leading-5 text-muted-foreground">
                • This verification link will expire in 1 hour
              </Text>
              <Text className="mb-2 text-[14px] leading-5 text-muted-foreground">
                • If you didn&apos;t create an account, you can safely ignore this email
              </Text>
              <Text className="text-[14px] leading-5 text-muted-foreground">
                • Never share this verification link with anyone
              </Text>
            </Section>

            {/* Footer */}
            <Section className="border-t border-muted pt-6 text-center">
              <Text className="m-0 mb-2 text-[12px] leading-4 text-muted-foreground">
                This email was sent to {userEmail}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
