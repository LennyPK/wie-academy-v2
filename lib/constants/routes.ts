export const ROUTES = {
  HOME: "/",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  // SIGN_UP_SUCCESS: "/auth/sign-up-success",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify",
  APPROVAL: "/auth/approval",
  UNAUTHENTICATED_ERROR: "/auth/error",
  UNAUTHORIZED_ERROR: "/app/unauthorized",

  DASHBOARD: "/app/dashboard",
  PROFILE: "/app/profile",
  ANNOUNCEMENTS: "/app/announcements",
  USER_MANAGEMENT: "/app/dashboard/students",
  EVENTS: "/app/events",
  EVENT_SURVEY: "/events/survey",
  EVENT_ATTENDANCE: "/api/events/attendance",
  FORUM: "/app/forum",
  EXPLORE: "/app/explore",
  QUIZ: "/app/explore/quiz",
  REPORT: "/report",
  CHAT: "/chat",
  LOGOUT: "/logout",
  ERROR: "/error",
}

export const AUTH_ROUTES = [
  ROUTES.SIGN_IN,
  ROUTES.SIGN_UP,
  ROUTES.VERIFY_EMAIL,
  ROUTES.APPROVAL,
  ROUTES.FORGOT_PASSWORD,
]

// type Primitive = string | number | boolean | null | undefined
// type ParamValue = Primitive | Primitive[]
// type QueryParams = Record<string, ParamValue>

// export function buildRoute(path: string, params?: QueryParams) {
//   if (!params) return path

//   const qs = new URLSearchParams()

//   for (const [key, raw] of Object.entries(params)) {
//     if (raw == null) continue

//     const values = Array.isArray(raw) ? raw : [raw]

//     for (const v of values) {
//       if (v == null) continue
//       qs.append(key, String(v))
//     }
//   }

//   const query = qs.toString()
//   return query ? `${path}?${query}` : path
// }
