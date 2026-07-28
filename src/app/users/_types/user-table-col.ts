import type { TUserResponse } from "@/api/main/users/types/user-response";

export type TUserTableCol = Omit<
  TUserResponse,
  "created_at" | "updated_at"
> & {};
