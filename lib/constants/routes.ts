export const routes = {
  HOME: "/",
  SIGN_IN: "/auth/sign-in",
  SIGN_UP: "/auth/sign-up",
  SIGN_UP_SUCCESS: "/auth/sign-up-success",
  FORGOT_PASSWORD: "/auth/forgot-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  ANNOUNCEMENTS: "/announcements",
  USER_MANAGEMENT: "/dashboard/students",
  EVENTS: "/events",
  EVENT_SURVEY: "/events/survey",
  EVENT_ATTENDANCE: "/api/events/attendance",
  FORUM: "/forum",
  LEARN: "/learn",
  REPORT: "/report",
  CHAT: "/chat",
  LOGOUT: "/logout",
  ERROR: "/error",
  UNAUTHENTICATED_ERROR: "/auth/error",
}

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
