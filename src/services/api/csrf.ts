import Cookies from "js-cookie";

import { cached } from "../../lib/cached";
import { ICancelToken } from "../../lib/cancelToken";
import { makeRequest } from "./request";
import { API_PATHS, apiUrl } from "./routes";

export class CsrfError extends Error {
  constructor(message: string) {
    super();
    this.name = "CsrfError";
    this.message = message;
  }
}

/** Read the CSRF-Token, or fetch on from the API and return that */
export async function getCsrfToken(cancelToken: ICancelToken): Promise<string> {
  const csrfToken = Cookies.get("CSRF-Token");

  if (csrfToken) return csrfToken;

  await syncCsrfToken(cancelToken);
  const newCsrfToken = Cookies.get("CSRF-Token");
  if (!newCsrfToken) throw new CsrfError("No CSRF token present. Possible CORS issue");

  return newCsrfToken;
}

/** Asynchronously fetch a new CSRF token from the API */
const syncCsrfToken = cached(
  async (cancelToken: ICancelToken): Promise<void> => {
    await makeRequest({
      method: "GET",
      url: apiUrl(API_PATHS.ROOT),
      withCredentials: true,
      cancelToken,
    });
  }
);
