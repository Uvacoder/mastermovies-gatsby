import { message } from "antd";
import axios, { CancelToken, CancelTokenSource, AxiosResponse } from "axios";

export const API_BASE = "https://api.mastermovies.uk/v2";

export function createCancelToken(): CancelTokenSource {
  return axios.CancelToken.source();
}

/* Get a valid CSRF token. Will query the API if one is not present */
export async function getCsrfToken(): Promise<string | null> {
  let token = readCsrfToken();

  if (!token) {
    const done = message.loading("Requesting CSRF token... This will only happen once.", 0);
    try {
      await axios.get(API_BASE, { withCredentials: true });
      token = await waitForCsrfToken(10); // Cookies may not be synchronous
    } catch (err) {
      message.error("Failed to request CSRF token");
      console.error("[API] Failed to request CSRF token:", err.message);
    } finally {
      done();
    }
  }

  if (token === null) message.error("Failed to request CSRF token");

  return token;
}

/** A recursive function to delay between reads */
async function waitForCsrfToken(retries: number): Promise<string | null> {
  const token = readCsrfToken();
  if (!token) {
    await new Promise(res => setTimeout(res, 500));
    return retries > 0? waitForCsrfToken(retries - 1) : null;
  }
  return token;
}

/* Search for the CSRF token in cookies */
function readCsrfToken() {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    if (cookie.substring(0, 11) === "CSRF-Token=") {
      return cookie.substring(11);
    }
  }
  return null;
}

export function retrieve<T>(url: string, cancelToken?: CancelToken): Promise<T> {
  return axios.get(url, { cancelToken }).then(result => result.data);
}

/** Returns the number of seconds until the ratelimter resets */
export function timeToReset(headers: AxiosResponse["headers"]): number {
  try {
    const header = headers["x-ratelimit-reset"];
    if (!isNaN(header)) {
      return Math.ceil((new Date(parseInt(header) * 1000).valueOf() - Date.now()) / 1000);
    }
  } catch {/* */}
  return 60; // 1 minute
}
