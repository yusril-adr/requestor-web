import * as z from "zod";

export const LoginFormSchema = z.object({
  email: z.email("Email is required"),
  password: z.string("Password is required"),
});

export type TLoginFormSchema = z.infer<typeof LoginFormSchema>;
