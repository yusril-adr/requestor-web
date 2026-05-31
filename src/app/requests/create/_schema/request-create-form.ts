import * as z from "zod";
import { RequestPriorityEnum } from "@/api/requestor/requests/enums/request-priority";

export const RequestCreateFormSchema = z.object({
  title: z.string("Title is required"),
  requestorName: z.string("Requestor name is required"),
  priority: z.enum(RequestPriorityEnum, "Priority is required"),
  assigneeName: z.string().optional(),
});

export type TRequestCreateFormSchema = z.infer<typeof RequestCreateFormSchema>;
