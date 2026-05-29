import type { TUserResponse } from "@/api/requestor/users/types/user-response";

export type TUserTableCol = Omit<
  TUserResponse,
  "created_at" | "updated_at"
> & {};
