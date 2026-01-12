import * as z from "zod"

export const formSchema = z
  .object({
    title: z.string().trim().min(1, "Title is required").max(100),
    description: z.string().trim().min(1, "Description is required"),
    category: z.string().nonempty("Category is required"),
    location: z.string().trim().min(1, "Location is required"),
    capacity: z.number().int().min(0),
    startDate: z.date("Start date is required"),
    endDate: z.date("End date is required"),
    startTime: z.date("Start time is required"),
    endTime: z.date("End time is required"),
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

    if (start >= end) {
      ctx.addIssue({
        code: "custom",
        message: " ",
        path: ["endDate"],
      })
      ctx.addIssue({
        code: "custom",
        message: "End date must be after start date",
        path: ["endTime"],
      })

      ctx.addIssue({
        code: "custom",
        message: " ",
        path: ["startDate"],
      })
      ctx.addIssue({
        code: "custom",
        message: "Start date must be before end date",
        path: ["startTime"],
      })
    }
  })
