import axios, { CancelToken } from "axios";
import { API_BASE, getCsrfToken } from "./common";

export interface IContactRequest {
  name?: string;
  email?: string;
  subject: string;
  message: string;
}

export async function contact(
  cancelToken: CancelToken,
  request: IContactRequest
) {
  return axios.post(API_BASE + "/comm/contact", request, {
    cancelToken,
    withCredentials: true,
    headers: { "CSRF-Token": await getCsrfToken() },
  });
}
