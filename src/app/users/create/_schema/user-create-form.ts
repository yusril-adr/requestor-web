import { RoleKeyEnum } from "@/common/enums/role-key";
import * as z from "zod";

export const UserCreateFormSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Email is required"),
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be at most 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
  role: z.enum(RoleKeyEnum, "Role is required"),
});

export type TUserCreateFormSchema = z.infer<typeof UserCreateFormSchema>;
