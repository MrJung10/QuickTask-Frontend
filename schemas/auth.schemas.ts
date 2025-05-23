import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email is invalid"),
  password: z.string()
    .min(1, "Password is required")
    .min(6 ,"Password must be at least 6 characters"),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, "Full name is required"),
    email: z.string().email("Email is invalid"),
    password: z.string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
    .min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
