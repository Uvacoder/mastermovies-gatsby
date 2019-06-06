import axios, { CancelToken } from "axios";
import { API_BASE, retrieve, getCsrfToken } from "./common";

export interface IMasterMoviesID {
  glacier?: {
    authorizations?: {
      [index: string]: number; // fingerprint => timestamp (expiry)
    }
  }
}


export function getAuth(cancelToken: CancelToken) {
  return axios.get<IMasterMoviesID>(
    API_BASE + "/auth/query",
    { cancelToken, withCredentials: true }
  ).then(response => response.data);
}

export async function hasFilmAuth(cancelToken: CancelToken, film: string): Promise<boolean> {
  const token = await getAuth(cancelToken);
  return typeof token === "object"
    && typeof token.glacier === "object"
    && typeof token.glacier.authorizations === "object"
    && typeof token.glacier.authorizations[film] === "number"
    && token.glacier.authorizations[film] > (Date.now() / 1000);
}

export async function authorise(cancelToken: CancelToken, film: string, key: string) {
  return axios.post(API_BASE + "/auth/authorize", {
    type: "film",
    resource: film,
    key
  }, {
    cancelToken,
    withCredentials: true,
    headers: { "CSRF-Token": await getCsrfToken() },
  });
}

export async function logout(cancelToken: CancelToken) {
  return axios.post(API_BASE + "/auth/logout", null, {
    cancelToken,
    withCredentials: true,
    headers: { "CSRF-Token": await getCsrfToken() },
  });
}