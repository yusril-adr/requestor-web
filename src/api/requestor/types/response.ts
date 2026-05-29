export type TRequestorApiBaseResponse = {
  status_code: number;
  error?: string;
};

export type TRequestorApiResponse<
  T,
  E = TRequestorApiErrorResponse<string>,
> = TRequestorApiBaseResponse & {
  status_code: number;
  data: T;
  error?: string;
  message: E[] | string;
};

export type TRequestorApiErrorResponse<T> = {
  property: keyof T;
  messages: string[];
};

export type TRequestorApiPaginationResponse<T> = TRequestorApiBaseResponse & {
  data: {
    items: T[];
    meta: TRequestorApiPaginationMetaResponse;
  };
};

export type TRequestorApiPaginationMetaResponse = {
  total_all_data: number;
  total_view: number;
  max_view: number;
  current_page: number;
  total_page: number;
};
