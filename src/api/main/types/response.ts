export type TMainApiBaseResponse = {
  status_code: number;
  error?: string;
};

export type TMainApiResponse<
  T,
  E = TMainApiErrorResponse<unknown>,
> = TMainApiBaseResponse & {
  status_code: number;
  data: T;
  error?: string;
  message: E[] | string;
};

export type TMainApiErrorResponse<T = unknown> = {
  property: keyof T | string;
  messages: string[];
};

export type TMainApiPaginationResponse<T> = TMainApiBaseResponse & {
  data: {
    items: T[];
    meta: TMainApiPaginationMetaResponse;
  };
};

export type TMainApiPaginationMetaResponse = {
  total_all_data: number;
  total_view: number;
  max_view: number;
  current_page: number;
  total_page: number;
};
