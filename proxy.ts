import { AUTH_ROUTES, ROUTES } from "@/constants"
import { auth } from "@/lib/auth"
import { ApprovalStatus, Role } from "@/prisma/enums"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Protect /app/*
  if (pathname.startsWith("/app")) {
    // Logged in
    if (!session) {
      return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.url))
    }

    // Email verified
    if (!session.user.emailVerified) {
      return NextResponse.redirect(new URL(ROUTES.VERIFY_EMAIL, request.url))
    }

    // Approval status
    if (session.user.approvalStatus !== ApprovalStatus.APPROVED) {
      return NextResponse.redirect(new URL(ROUTES.APPROVAL, request.url))
    }

    // Admin pages access
    if (pathname.startsWith("/app/admin") && session.user.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL(ROUTES.UNAUTHORIZED_ERROR, request.url))
    }

    return NextResponse.next()
  }

  // Bounce authenticated users away from auth pages
  if (AUTH_ROUTES.includes(pathname) && session) {
    if (session.user.approvalStatus === ApprovalStatus.APPROVED) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url))
    }

    // Logged in but not approved
    if (pathname !== ROUTES.APPROVAL) {
      return NextResponse.redirect(new URL(ROUTES.APPROVAL, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/app/:path*", "/auth/:path*"], // Specify the routes the middleware applies to
}
