import { API_ADDRESS } from "../config";
import { ErrorCode, SuccessCode } from "../types/StatusCode";
import { ResponseError } from "./ResponseError";

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;

interface JSONObject {
  [key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

type Body = {
  [key: string]: string | undefined | null;
};

type CustomResponse = Response & { status: SuccessCode | ErrorCode };
type ErrorResponseData = { message: string };

export async function callAPI<T extends JSONValue | void = void>(
  url: string,
  body?: Body,
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

  throw new ResponseError(response.status, error.message);
}
