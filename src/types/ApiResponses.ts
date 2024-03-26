export enum ResponseStatus {
  OK = "OK",
  ERROR = "ERROR"
}

export enum ErrorType {
  UNAUTHORIZED = "UNAUTHORIZED",
  TOKEN_ERROR = "TOKEN_ERROR",
  INVALID_PARAMS = "INVALID_PARAMS",
  DATABASE_ERROR = "DATABASE_ERROR",
  HASH_PARSING = "HASH_PARSING",
  USER_EXISTS = "USER_EXISTS",
  BOT_EXISTS = "BOT_EXISTS",
  NO_RESULT = "NO_RESULT",
  MAIL_ERROR = "MAIL_ERROR",
}

export type ErrorResponse = {
  status: ResponseStatus.ERROR;
  error: ErrorType;
}

export type ValidResponse = {
  status: ResponseStatus.OK;
}

export type ValidDataResponse = {
  status: ResponseStatus.OK;
  data: any;
}

export type ApiResponse = ErrorResponse | ValidResponse | ValidDataResponse;