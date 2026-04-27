import { email, z } from "zod";

export const signupSchema = z.object({
  firstName: z
    .string({
      required_error: "First Name is required",
      invalid_type_error: "First Name is required", // 👈 this fires when field is missing
    })
    .trim()
    .min(1, "First Name cannot be empty"),

  lastName: z
    .string({
      required_error: "Last Name is required",
      invalid_type_error: "Last Name is required", // 👈
    })
    .trim()
    .min(1, "Last Name cannot be empty"),

  email: z
    .string({
      required_error: "Email is required",
      invalid_type_error: "Email is required", // 👈
    })
    .email("Invalid email format"),

  password: z
    .string({
      required_error: "Password is required",
      invalid_type_error: "Password is required", // 👈
    })
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string("email is required")
    .email("not a valid email format ")
    .trim()
    .lowercase(),

  password: z
    .string("password is required")
    .trim()
    .min(1, `password more then 1 char`),
});
