import * as z from "zod";

export const AuditLogTableFilterSchema = z.object({
  action: z.string().nullish().optional(),
  targetType: z.string().nullish().optional(),
});

export type TAuditLogTableFilterSchema = z.infer<
  typeof AuditLogTableFilterSchema
>;
