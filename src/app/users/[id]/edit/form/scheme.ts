import { UserStatusEnum } from "@/api/requestor/users/enums/user-status";
import { RoleKeyEnum } from "@/common/enums/role-key";
import * as z from "zod";

export const UserEditFormSchema = z.object({
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
    )
    .optional(),
  role: z.enum(RoleKeyEnum, "Role is required"),
  status: z.enum(UserStatusEnum, "Status is required"),
});

export type TUserEditFormSchema = z.infer<typeof UserEditFormSchema>;
