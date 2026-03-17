import { Container, Section, Text } from "@react-email/components"
import React from "react"
import { colors, style } from "../theme"

function Card({
  children,
  className,
  style: styleProp,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Container
      className={className}
      style={{
        ...style.card,
        maxWidth: "600px",
        margin: "0 auto",
        ...styleProp,
      }}
    >
      {children}
    </Container>
  )
}

function CardHeader({
  children,
  className,
  style: styleProp,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Section
      className={className}
      style={{
        padding: "40px 32px 0 32px",
        textAlign: "center",
        // border: `1px solid ${colors["muted-foreground"]}`,
        ...styleProp,
      }}
    >
      {children}
    </Section>
  )
}

function CardContent({
  children,
  className,
  style: styleProp,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Section
      className={className}
      style={{
        padding: "24px 32px",
        // border: `1px solid ${colors["muted-foreground"]}`,
        ...styleProp,
      }}
    >
      {children}
    </Section>
  )
}

function CardFooter({
  children,
  className,
  style: styleProp,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <Section
      className={className}
      style={{
        padding: "24px 32px",
        borderTop: `1px solid ${colors.border}`,
        textAlign: "center",
        // justifyItems: "center",
        // border: `1px solid ${colors["muted-foreground"]}`,
        ...styleProp,
      }}
    >
      <Text className="mt-0 mb-0 text-[14px] font-semibold text-primary">
        Women in Engineering Academy
      </Text>
      <Text className="mt-0 text-[12px] text-muted-foreground">Inspire, Connect, Empower</Text>
      {children}
    </Section>
  )
}

export { Card, CardContent, CardFooter, CardHeader }
