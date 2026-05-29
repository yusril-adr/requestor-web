import * as z from "zod";

export const UserTableFilterSchema = z.object({
  status: z.string().nullish().optional(),
  role: z.string().nullish().optional(),
});

export type TUserTableFilterSchema = z.infer<typeof UserTableFilterSchema>;
