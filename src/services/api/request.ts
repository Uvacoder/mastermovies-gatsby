import Axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";

import { Cancel, cancelTokenSource, ICancelToken, TCancelFunction } from "../../lib/cancelToken";
import { getCsrfToken } from "./csrf";
import { apiUrl } from "./routes";

/**
 * A low-level function to make an Axios request with automatic CSRF fetching
 */
export async function makeRequest<T>(
  requestConfig: AxiosRequestConfig,
  cancelToken?: ICancelToken
): Promise<AxiosResponse<T>> {
  const isBasicRequest: boolean = !requestConfig.method || requestConfig.method.toLowerCase() === "get";

  const csrf = isBasicRequest ? void 0 : await getCsrfToken(cancelToken);

  // Add defaults but allow override
  return Axios.request<T>({
    withCredentials: !isBasicRequest,
    cancelToken,
    ...requestConfig,
    headers: {
      "CSRF-Token": csrf,
      ...requestConfig.headers,
    },
  });
}

interface IRequest<T> {
  request: AxiosPromise<{ data: T }>;
  cancel: TCancelFunction;
  listeners: number;
}

/** Cache concurrent request, each with its own cancel token and number of listeners */
const dataCache: { [index: string]: IRequest<any> } = {};

/**
 * A simple JSON data resource fetching function. Uses the makeRequest function, but returns the
 * `data` field from a HTTP JSON response, or `null` on a `404 Not Found`.
 *
 * This function only supports stateless GET requests, identical concurrent requests will be
 * cached in memory until the request is resolved and the browser cache is warm.
 *
 * @param {string} path The relative API path of the data resource to fetch
 * @param {CancelToken} cancelToken Used to cancel the promise chain
 * @param {boolean} rawResponse Return the entire response, and not just the data field
 * @throws {AxiosError} The Promise can reject into an Axios HTTP-based error
 */
export async function getData<T extends {}>(
  path: string,
  cancelToken?: ICancelToken,
  rawResponse: boolean = false
): Promise<T | null> {
  // If the cache doesn't an identical request, create it
  if (!dataCache[path]) {
    const { token, cancel } = cancelTokenSource();
    const newRequest = makeRequest<{ data: T }>({
      method: "GET",
      url: apiUrl(path),
      cancelToken: token,
    });

    dataCache[path] = {
      request: newRequest,
      cancel,
      listeners: 0,
    };
  }

  const request = dataCache[path] as IRequest<T>;

  try {
    // Wait until cancelled or request resolves
    request.listeners++;
    const race = await Promise.race([cancelToken.promise, request.request]);

    // Return `data` or throw `Cancel`
    if (race instanceof Cancel) {
      throw race;
    } else {
      if (rawResponse) return race.data;
      return race.data.data;
    }
  } catch (err) {
    // Return `null` if 404 or throw the error
    if (err && err.response && (err as AxiosError).response.status === 404) {
      return null;
    } else {
      throw err;
    }
  } finally {
    // Remove request from cache if all listeners have been removed
    request.listeners--;
    if (request.listeners === 0) delete dataCache[path];
  }
}
