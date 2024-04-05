export enum ResponseStatus {
  OK = "OK",
  ERROR = "ERROR",
}

export enum ErrorType {
  UNAUTHORIZED = "UNAUTHORIZED",
  NO_SUBSCRIPTION = "NO_SUBSCRIPTION",
  INVALID_PARAMS = "INVALID_PARAMS",
  NO_RESULT = "NO_RESULT",
  ALREADY_EXISTING = "ALREADY_EXISTING",
  DATABASE_ERROR = "DATABASE_ERROR",
  STRIPE_ERROR = "STRIPE_ERROR",
  TOKEN_ERROR = "TOKEN_ERROR",
  HASH_PARSING = "HASH_PARSING",
  MAIL_ERROR = "MAIL_ERROR",
}

export type ErrorResponse = {
  status: ResponseStatus.ERROR;
  error: ErrorType;
};

export type ValidResponse = {
  status: ResponseStatus.OK;
};

export type ValidDataResponse = {
  status: ResponseStatus.OK;
  data: any;
};

export type ApiResponse = ErrorResponse | ValidResponse | ValidDataResponse;
