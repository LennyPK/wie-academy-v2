import * as z from "zod"

export const formCreateSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  category: z.string().nonempty("Category is required"),
  regions: z.array(z.string()),
  schools: z.array(z.string()),
  yearLevels: z.array(z.string()),
  content: z.string().min(1, "Content is required"),
  // contentHtml: z.string(),
  // contentJson: z.object(),
})
