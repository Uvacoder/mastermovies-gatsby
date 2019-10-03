import { ICancelToken } from "../../lib/cancelToken";
import { acquireAuthToken, getAuthPayload, getAuthToken } from "./auth";
import { makeRequest } from "./request";
import { API_PATHS, apiUrl } from "./routes";

interface IGlacierFilmAuthRequest {
  type: "film";
  resourceId: number;
  key?: string;
}

interface IGlacierDownloadAuthRequest {
  type: "download";
  resourceId: number;
}

export enum EGlacierFilmAuth {
  ACCEPTED,
  REJECTED,
  EXPIRED,
}

export enum EGlacierAuthState {
  /** Authorisation is missing from the session */
  NO_AUTH,
  ACCEPTED,
  REJECTED,
  EXPIRED,
}

/**
 * Asynchronous function to add a film authorisation to the session.
 * Requires a lock on the session token.
 */
export async function authoriseGlacierFilm(
  filmId: number,
  key?: string,
  cancelToken?: ICancelToken
): Promise<EGlacierFilmAuth> {
  return acquireAuthToken(async (token, update) => {
    const requestPayload: IGlacierFilmAuthRequest = {
      type: "film",
      resourceId: filmId,
    };

    if (key) requestPayload.key = key;

    const { status, data } = await makeRequest<{ token?: string; message?: string }>({
      url: apiUrl(API_PATHS.GLACIER.AUTHORISE),
      method: "POST",
      withCredentials: true,
      data: requestPayload,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cancelToken,
    });

    if (status === 200) {
      if (typeof data.token === "undefined") throw new Error("Session token missing in server response");

      update(data.token);
      return EGlacierFilmAuth.ACCEPTED;
    }

    if (data && data.message && data.message.toLowerCase().indexOf("expired") !== -1) {
      return EGlacierFilmAuth.EXPIRED;
    }

    return EGlacierFilmAuth.REJECTED;
  });
}

/**
 * Asynchronous function to generate a download authorisation. This requires the session
 * to hold a valid film authorisation for the requested film.
 *
 * @throws {AxiosError} If a network error occurred
 */
export async function authoriseGlacierDownload(
  filmId: number,
  cancelToken?: ICancelToken
): Promise<{ status: EGlacierAuthState; authorisation?: string }> {
  const payload = await getAuthPayload();

  // Thanks to JWT magic, check that the token is valid and contains the correct authorisation before requesting
  if (payload && typeof payload.exp === "number" && payload.exp < Math.floor(Date.now() / 1000))
    return { status: EGlacierAuthState.EXPIRED };
  if (payload && payload.glacier && payload.glacier.auth) {
    if (typeof payload.glacier.auth[filmId] !== "number") return { status: EGlacierAuthState.NO_AUTH };
  }

  const authToken = await getAuthToken(cancelToken);

  const requestPayload: IGlacierDownloadAuthRequest = {
    type: "download",
    resourceId: filmId,
  };

  const { status, data } = await makeRequest<{ authorisation?: string; message?: string }>({
    url: apiUrl(API_PATHS.GLACIER.AUTHORISE),
    method: "POST",
    withCredentials: true,
    data: requestPayload,
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (status === 200) {
    return { status: EGlacierAuthState.ACCEPTED, authorisation: data.authorisation };
  }

  if (data && data.message && data.message.toLowerCase().indexOf("expired") !== -1) {
    return { status: EGlacierAuthState.EXPIRED };
  }

  return { status: EGlacierAuthState.REJECTED };
}
