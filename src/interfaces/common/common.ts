export type ApiResponseBase = {
  status: "SUCCESS" | "ERROR";
  timestamp: string;
};

export type ErrorResponse = ApiResponseBase & {
  errorCode: string;
  description: string;
};

export type SuccessResponse<T> = ApiResponseBase & {
  data: T;
};

export type PagedResponse<T> = {
  content: Array<T>;
  meta: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
};

export type BaseModelResponse = {
  id: number;
  createdAt?: string;
  updatedAt?: string;
};
