import * as z from "zod";

export const RequestTableFilterSchema = z.object({
  priority: z.string().nullish().optional(),
  status: z.string().nullish().optional(),
});

export type TRequestTableFilterSchema = z.infer<
  typeof RequestTableFilterSchema
>;
