export const colors = {
  background: "#f5f5ff",
  foreground: "#2a2a4a",
  border: "#e0e0f0",
  card: "#ffffff",
  "card-foreground": "#2a2a4a",

  muted: "#f0f0fa",
  "muted-foreground": "#6c6c8a",
  primary: "#6e56cf",
  "primary-foreground": "#ffffff",
  secondary: "#e4dfff",
  "secondary-foreground": "#4a4080",
  accent: "#d8e6ff",
  "accent-foreground": "#2a2a4a",

  destructive: "#ff5470",
  "destructive-foreground": "#ffffff",
  success: "#1bcf5e",
  "success-foreground": "#ffffff",
  warning: "#f59f08",
  "warning-foreground": "#000000",
  info: "#338bff",
  "info-foreground": "#ffffff",
}

export const radius = "10px"

export const style = {
  // Typography
  body: {
    fontSize: "14px",
    color: colors.foreground,
    lineHeight: "1.6",
    // margin: "0 0 16px",
  } as React.CSSProperties,
  heading: {
    fontSize: "24px",
    fontWeight: "700",
    color: colors.foreground,
    lineHeight: "1.3",
    margin: "0 0 8px",
  } as React.CSSProperties,
  muted: {
    fontSize: "13px",
    color: colors["muted-foreground"],
    lineHeight: "1.6",
    margin: "0 0 16px",
  } as React.CSSProperties,

  // Components
  card: {
    backgroundColor: colors.card,
    borderRadius: radius,
  } as React.CSSProperties,

  button: {
    backgroundColor: colors.primary,
    borderRadius: radius,
    color: colors["primary-foreground"],
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    padding: "16px 32px",
    display: "inline-block",
  } as React.CSSProperties,

  link: {
    color: colors.primary,
    textDecoration: "underline",
    fontSize: "14px",
    wordBreak: "break-all",
  } as React.CSSProperties,
}
