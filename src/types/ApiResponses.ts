export enum ResponseStatus {
  OK = "OK",
  ERROR = "ERROR"
}

export enum ErrorType {
  INVALID_PARAMS = "INVALID_PARAMS",
  DATABASE_ERROR = "DATABASE_ERROR",
  HASH_PARSING = "HASH_PARSING",
  USER_EXISTS = "USER_EXISTS",
  NO_RESULT = "NO_RESULT",
  MAIL_ERROR = "MAIL_ERROR",
}

export type ApiResponse = {
  status: ResponseStatus;
  data?: any;
  error?: ErrorType;
}