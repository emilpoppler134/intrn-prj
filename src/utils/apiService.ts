import { API_ADDRESS } from "../config";
import { ErrorCode, SuccessCode } from "../types/StatusCode";
import { ControlledError } from "./ControlledError";

type JSONValue = string | number | boolean | None | JSONObject | JSONArray;
type JSONObject = { [key: string]: JSONValue };
type JSONArray = Array<JSONValue>;
type None = null | undefined;
type Data = JSONObject | JSONArray;

type CustomResponse = Response & { status: SuccessCode | ErrorCode };
type ErrorResponseData = { message: string };

export async function callAPI<T extends Data | void = void>(
  url: string,
  body?: Data,
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers = new Headers({ "Content-Type": "application/json" });

  if (token !== null) {
    headers.append("Authorization", "Bearer " + token);
  }

  const options: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify(body !== undefined ? body : {}),
  };

  const response: CustomResponse = await fetch(API_ADDRESS + url, options);

  if (response.status === SuccessCode.NO_CONTENT) return undefined as T;

  const data: T | ErrorResponseData = await response.json();

  if (
    response.status === SuccessCode.OK ||
    response.status === SuccessCode.CREATED
  ) {
    const validData = data;
    return validData as T;
  }

  const error = data as ErrorResponseData;

  switch (response.status) {
    case ErrorCode.UNAUTHORIZED: {
      localStorage.removeItem("token");
      window.location.href = "/login";
      break;
    }

    case ErrorCode.FORBIDDEN: {
      window.location.href = "/dashboard";
      break;
    }
  }

  throw new ControlledError(response.status, error.message);
}
