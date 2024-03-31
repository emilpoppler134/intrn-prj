import axios, { AxiosResponse } from "axios";

import { API_ADDRESS } from "../config";
import { ApiResponse, ValidResponse, ValidDataResponse, ErrorResponse, ResponseStatus, ErrorType } from "../types/ApiResponses";

type Body = { [key: string]: string | undefined };

export async function callAPI<T>(url: string, body?: Body): Promise<ValidResponse | ValidDataResponse & { data: T } | ErrorResponse | null> {
  try {
    const axiosResponse: AxiosResponse = await axios.post(API_ADDRESS + url, body);
    const response: ApiResponse = axiosResponse.data;

    if (response === null) {
      return null;
    }

    if (response.status === ResponseStatus.ERROR) {      
      if (response.error === ErrorType.UNAUTHORIZED) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      if (response.error === ErrorType.NO_SUBSCRIPTION) {
        window.location.href = "/dashboard";
      }
      return { status: ResponseStatus.ERROR, error: response.error } as ErrorResponse;
    }

    const isValidDataResponse = (
      (r: ValidResponse | ValidDataResponse): r is ValidDataResponse => {
        return (r as ValidDataResponse).data !== undefined;
      }
    )(response);

    if (!isValidDataResponse) {
      return { status: ResponseStatus.OK } as ValidResponse;
    }

    return { status: ResponseStatus.OK, data: response.data } as ValidDataResponse & { data: T };
  } catch {
    return null;
  }
}