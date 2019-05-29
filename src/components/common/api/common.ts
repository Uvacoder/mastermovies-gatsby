import axios, { CancelTokenSource } from "axios";
import { message } from "antd";

export const API_BASE = "https://api.mastermovies.uk/v2";

export function createCancelToken(): CancelTokenSource {
  return axios.CancelToken.source();
}

/* Get a valid CSRF token. Will query the API if one is not present */
export async function getCsrfToken() {
  let token = findCsrfCookie();

  if (!token) {
    const done = message.loading("Requesting CSRF token... This will only happen once.", 0);
    try {
      await axios.get(API_BASE);
      await new Promise(res => setTimeout(res, 1000)); // wait for cookies to update
    } finally {
      done();
    }
    token = findCsrfCookie();
  }

  return token;
}

/* Search for the CSRF token in cookies */
function findCsrfCookie() {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    if (cookie.substring(0, 11) === "CSRF-Token=") {
      return cookie.substring(11);
    }
  }
  return null;
}
