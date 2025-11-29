"use server"

import { signUpSchema } from "@/app/auth/sign-up/_components/form"
import z from "zod"
import { prisma } from "../prisma"
import { authClient } from "./client"

export type RegionOption = {
  id: number
  value: string
  label: string
}

export type YearLevelOption = {
  id: number
  value: string
  label: string
}

export async function getRegions() {
  return await prisma.region.findMany({
    orderBy: { label: "asc" },
  })
}

export async function getYearLevels() {
  return await prisma.yearLevel.findMany({
    orderBy: { id: "asc" },
  })
}

// TODO: this code does not work
export async function registerUser(payload: z.infer<typeof signUpSchema>) {
  const data = signUpSchema.parse(payload)

  const authResult = await authClient.signUp.email({
    email: data.email,
    password: data.password,
    name: `${data.firstName} ${data.lastName}`,
    // image: null,
    callbackURL: "/dashboard",
  })

  const userId = authResult.data?.user?.id
  if (!userId) {
    throw new Error("Auth provider did not return a user id")
  }

  try {
    await prisma.memberInfo.create({
      data: {
        userId,
        school: data.school,
        regionId: Number.parseInt(data.region),
        yearId: Number.parseInt(data.yearLevel),
        birthDate: data.dob || "",
        // TODO: Delete exp reference after migration/push (now listed as a default value)
        experiencePoints: 0,
      },
    })
  } catch (createError) {
    try {
      await authClient.deleteUser({
        token: authResult.data?.token || undefined,
      })
    } catch (deleteError) {
      console.error(`Failed to clean up user after profile creation error: ${deleteError}`)
    }

    throw createError
  }

  return { userId }
}

/* Example code temporarily commented out
import { LoginFormValues, RegisterFormValues } from "@/components/forms/types"
import { FUNCTIONS } from "@/lib/database"
import { routes } from "@/lib/routes"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "../database/user/server"
import { authClient } from "./client"

// FIXME: Replace with BetterAuth logic

export async function registerUser(data: RegisterFormValues) {
  const supabase = await createClient()

  try {
    // 1. Create the Auth user
    const { data: authData, error: authError } = await authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
        name: `${data.firstName} ${data.lastName}`,
        // options: {
        //   emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
        //   data: {
        //     first_name: data.firstName,
        //     last_name: data.lastName,
        //   },
        // },
      },
      {
        onRequest: () => {},
      }
    )

    if (authError) {
      // Handle specific Supabase errors
      if (authError.message.includes("already registered")) {
        return {
          error: "A user with this email already exists.",
          field: "email",
        }
      }

      return {
        error: authError.message,
        field: "general",
      }
    }

    // 2. Insert a row into your user table
    if (authData.user) {
      console.log("Attempting to insert user profile for:", authData.user.id)

      const { data: insertData, error: insertError } = await supabase
        .rpc(FUNCTIONS.CREATE_USER_RECORD, {
          _id: authData.user.id,
          _email: data.email,
          _first_name: data.firstName,
          _last_name: data.lastName,
          _school: data.school,
          _region: data.region,
          _year_level: Number(data.yearLevel),
          _birth_date: data.dob,
        })
        .select()

      if (insertError) {
        console.error("Error inserting profile:", insertError)
        console.error("Error details:", {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
        })
        // You might want to handle this error more gracefully
        // For now, we'll continue but log the error
      } else {
        console.log("Successfully inserted user profile:", insertData)
      }
    }

    // 3. Return or redirect
    if (authData.user && !authData.user.email_confirmed_at) {
      return {
        success: true,
        message: "Registration successful! Please check your email to confirm your account.",
      }
    }

    redirect(routes.SIGN_UP_SUCCESS)
  } catch (error) {
    console.error("Registration error:", error)
    return {
      error: "An unexpected error occurred. Please try again.",
      field: "general",
    }
  }
}

export async function loginUser(data: LoginFormValues) {
  // Check if environment variables are set
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
  ) {
    console.error("Missing Supabase environment variables")
    return {
      error: "Authentication service is not properly configured. Please contact support.",
      field: "general",
    }
  }

  const supabase = await createClient()

  try {
    console.log("Attempting login for email:", data.email)

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    const user = await getUser()
    if (user.approval_status != "approved") {
      return {
        error:
          "Please wait until your registration gets approved before signing in or contact WiE admins for assistance.",
        field: "general",
      }
    }

    console.log("Auth response:", { authData, authError })

    if (authError) {
      console.log("Auth error:", authError.message)

      // Handle specific login errors
      if (authError.message.includes("Invalid login credentials")) {
        return {
          error: "Invalid email or password. Please try again.",
          field: "general",
        }
      }

      if (authError.message.includes("Email not confirmed")) {
        return {
          error: "Please check your email and confirm your account before signing in.",
          field: "email",
        }
      }

      return {
        error: authError.message,
        field: "general",
      }
    }

    if (authData.user) {
      console.log("Login successful for user:", authData.user.email)
      // Successful login - return success instead of redirecting
      return {
        success: true,
        message: "Login successful!",
      }
    }

    return {
      error: "Login failed. Please try again.",
      field: "general",
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      error: `An unexpected error occurred: ${error instanceof Error ? error.message : "Unknown error"}`,
      field: "general",
    }
  }
}

export async function logout() {
  await authClient.signOut()

  // await authClient.signOut({
  //   fetchOptions: {
  //     onSuccess: () => {
  //       router.push("/login") // redirect to login page
  //     },
  //   },
  // })

  // if (error) {
  //   console.error("Logout error:", error)
  //   return {
  //     error: "Failed to logout. Please try again.",
  //     field: "general",
  //   }
  // }
}
*/
