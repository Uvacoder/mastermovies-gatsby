import { ICancelToken } from "../../lib/cancelToken";
import { makeRequest } from "./request";
import { API_PATHS, apiUrl } from "./routes";

export interface IContactRequest {
  name?: string;
  email?: string;
  subject: string;
  message: string;
}

export async function submitContact(fields: IContactRequest, cancelToken?: ICancelToken) {
  return makeRequest({
    method: "POST",
    url: apiUrl(API_PATHS.SERVICES.CONTACT),
    data: fields,
    withCredentials: true,
    cancelToken,
  });
}
