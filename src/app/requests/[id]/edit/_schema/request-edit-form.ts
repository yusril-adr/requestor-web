import * as z from "zod";
import { RequestPriorityEnum } from "@/api/requestor/requests/enums/request-priority";
import { RequestStatusEnum } from "@/api/requestor/requests/enums/request-status";

export const RequestEditFormSchema = z.object({
  title: z.string("Title is required"),
  requestorName: z.string("Requestor name is required"),
  priority: z.enum(RequestPriorityEnum, "Priority is required"),
  status: z.enum(RequestStatusEnum, "Status is required"),
  assigneeName: z.string().optional(),
});

export type TRequestEditFormSchema = z.infer<typeof RequestEditFormSchema>;
