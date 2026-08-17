import { z } from "zod"

// data is sent to backend from contact form
export const createContactSchema = z.object({
  name: z.string().trim().min(2, " Required. At least 2 characters"),

  email: z.string().trim().email("valid email address"),

  phone: z
    .string()
    .trim()
    .regex(/^[1-9]\d{9}$/, "Valid 10-digit mobile number "),
  subject: z.string().trim().min(3, " Required. At least 3 characters"),

  message: z.string().trim().min(10, " Required. At least 10 characters"),
})

// contact is coming to admin dashbaord form backend
const apiTextField = z.preprocess((value) => {
  if (value === null || value === undefined) {
    return ""
  }

  return String(value).trim()
}, z.string())

export const contactSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: apiTextField,
  email: apiTextField,
  phone: apiTextField,
  subject: apiTextField,
  message: apiTextField,
})
//  data type of contact form
export type CreateContactData = z.infer<typeof createContactSchema>

// data type of admin table

export type Contact = z.infer<typeof contactSchema>
