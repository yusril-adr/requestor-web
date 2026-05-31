import type { RequestPriorityEnum } from "../enums/request-priority";

export type TRequestCreatePayload = {
  title: string;
  requestor_name: string;
  priority: RequestPriorityEnum;
  assignee_name?: string | null;
};
