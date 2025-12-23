import * as z from "zod"

export const formSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(100),
    description: z.string().trim().min(1, "Content is required"),
    category: z.string().nonempty("Category is required"),
    location: z.string().trim().min(1, "Location is required"),
    capacity: z.number().int().positive(),
    startDate: z.date().refine((date) => !!date, { message: "Start date is required" }),
    startTime: z.date().refine((time) => !!time, { message: "Start time is required" }),
    endDate: z.date().refine((date) => !!date, { message: "End date is required" }),
    endTime: z.date().refine((time) => !!time, { message: "End time is required" }),
  })
  .superRefine((data, ctx) => {
    const start = new Date(
      data.startDate.getFullYear(),
      data.startDate.getMonth(),
      data.startDate.getDate(),
      data.startTime.getHours(),
      data.startTime.getMinutes(),
      data.startTime.getSeconds()
    )
    const end = new Date(
      data.endDate.getFullYear(),
      data.endDate.getMonth(),
      data.endDate.getDate(),
      data.endTime.getHours(),
      data.endTime.getMinutes(),
      data.endTime.getSeconds()
    )

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid date/time" })
    } else if (start >= end) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Start must be before end" })
    }
  })
