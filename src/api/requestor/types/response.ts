export type TRequestorApiResponse<T, E = TRequestorApiErrorResponse<string>> = {
  status_code: number;
  data: T;
  error?: string;
  message: E[] | string;
};

export type TRequestorApiErrorResponse<T> = {
  property: keyof T;
  messages: string[];
};
