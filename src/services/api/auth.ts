import { cached } from "../../lib/cached";
import { ICancelToken } from "../../lib/cancelToken";
import { IJwt } from "../../types/auth";
import { makeRequest } from "./request";
import { API_PATHS, apiUrl } from "./routes";
import { createSecureStore } from "./secure_store";

export type TJwt = string | null;

// The secure JWT store
const store = createSecureStore();

/**
 * Retrieve (or restore) the JWT authorisation token.
 *
 * First time call will conduct a one-off session restoration which queries the API.
 * This may be cancelled with a Cancel Token.
 *
 * @throws {IHumanError} A human compatible error object
 */
export async function getAuthToken(cancelToken?: ICancelToken): Promise<TJwt> {
  await checkRestored(cancelToken);
  return store.get<TJwt>("jwt");
}

/** Update the JWT authorisation token */
export async function setAuthToken(newToken: TJwt): Promise<void> {
  return store.set<TJwt>("jwt", newToken);
}

/**
 * A more complex function to acquire an async lock on the token. See `SecureStore.acquire()`
 * Acquires an asynchronous lock on the JWT token and allows reading and setting the token atomically.
 *
 * The return value of the `fn` is passed through to the return value of this function.
 */
export async function acquireAuthToken<R>(
  fn: (value: TJwt, update: (newValue: any) => void) => R | PromiseLike<R>,
  cancelToken?: ICancelToken
): Promise<R> {
  await checkRestored(cancelToken);
  return store.acquire<TJwt, R, TJwt>("jwt", fn);
}

// Whether a first-time session restoration has been executed
let restored: boolean = false;

/** Checks whether a first time restoration has happened. Calls `restoreSession()` */
async function checkRestored(cancelToken: ICancelToken): Promise<void> {
  if (!restored) {
    await restoreSession(cancelToken);
    restored = true;
  }
}

/**
 * Restore the old session from the API and update the JWT store
 *
 * @throws {AxiosError} If a network error occurred
 */
const restoreSession = cached(
  async (cancelToken?: ICancelToken): Promise<void> => {
    const response = await makeRequest<{ token: TJwt }>({
      method: "POST",
      url: apiUrl(API_PATHS.AUTH.RESTORE),
      withCredentials: true,
      cancelToken,
    });

    await store.set<TJwt>("jwt", response.data.token);
  }
);

/**
 * Read the Auth token from the JWT store and return the decoded payload.
 * The Cancel Token will be passed through to the `getAuthToken()` function.
 *
 * @throws {AxiosError} If a network error occurred
 */
export async function getAuthPayload(cancelToken?: ICancelToken): Promise<IJwt> {
  const token = await getAuthToken(cancelToken);

  if (typeof token === "string") {
    const payload = token.split(".")[1];

    if (typeof payload === "string") {
      try {
        return JSON.parse(atob(payload));
      } catch (err) {
        err.message = "Unable to decode JWT: " + err.message;
        throw err;
      }
    }
  }

  return null;
}

/**
 * Logout from the API. The Cancel Token is used to cancel the network request.
 *
 * @throws {AxiosError} If a network error occurred
 */
export async function authLogout(cancelToken?: ICancelToken): Promise<void> {
  await makeRequest({
    method: "POST",
    url: apiUrl(API_PATHS.AUTH.LOGOUT),
    withCredentials: true,
    cancelToken,
  });

  return setAuthToken(null);
}
