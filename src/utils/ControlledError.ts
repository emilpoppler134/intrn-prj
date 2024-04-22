import { ErrorCode } from "../types/StatusCode";

export class ControlledError extends Error {
  status: ErrorCode;

  constructor(
    status: ErrorCode = ErrorCode.SERVER_ERROR,
    message: string = "Something went wrong.",
  ) {
    super(message);
    this.status = status;
  }
}
