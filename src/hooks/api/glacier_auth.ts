import { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { cancelTokenSource, TCancelFunction } from "../../lib/cancelToken";
import { getAuthPayload } from "../../services/api/auth";
import { humanError } from "../../services/api/error";
import { authoriseGlacierDownload, authoriseGlacierFilm, EGlacierAuthRequest } from "../../services/api/glacier";
import { getData } from "../../services/api/request";
import { API_PATHS } from "../../services/api/routes";
import { IHumanError } from "../../types/app";
import { IGlacier } from "../../types/glacier";
import { TRetryFunction } from "./request";

/**
 * The authorisation state of the the useGlacierAuth hook. A state with
 * `ACTION REQUIRED` requires additional interaction in order to proceed.
 */
export enum EAuthStatus {
  /** `ACTION REQUIRED` Waiting for a film to process */
  READY,
  /** Querying film information from API */
  QUERY,
  /** `ACTION REQUIRED` Waiting for unlock key */
  PROMPT,
  /** Authorising film */
  AUTH,
  /** Requesting download/stream token */
  REQUEST,
  /** All OK */
  SUCCESS,
  /** `ACTION REQUIRED` Unlock key was rejected */
  FAILED,
  /** `ACTION REQUIRED` An error occurred */
  ERROR,
}

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

/**
 * A React hook to authorise a Glacier film
 *
 * @returns {Array} The auth status, the download/stream token, a function to set the key (if prompted), an error (if occurred) and a retry function
 */
export function useGlacierAuth(filmId?: number): [EAuthStatus, string, SetState<string>, IHumanError, TRetryFunction] {
  const [status, setStatus] = useState(EAuthStatus.READY);
  const [error, setError] = useState<IHumanError>();
  const [auth, setAuth] = useState<string>();
  const [key, setKey] = useState<string>();

  const reset = () => {
    setError(void 0);
    setAuth(void 0);
    setKey(void 0);
    if (typeof filmId !== "number") {
      setStatus(EAuthStatus.READY);
    } else {
      setStatus(EAuthStatus.QUERY);
    }
  };

  // Handle filmId changes
  useEffect(() => {
    reset();
  }, [filmId]);

  // Main logic
  useEffect(() => {
    switch (status) {
      case EAuthStatus.QUERY:
        return doQuery(filmId, setStatus, setError);
      case EAuthStatus.AUTH:
        return doAuth(filmId, key, setStatus, setError);
      case EAuthStatus.REQUEST:
        return doRequest(filmId, setStatus, setError, setAuth);
    }
  }, [status]);

  return [status, auth, setKey, error, reset];
}

/** Query film information to determine if an unlock key is required */
function doQuery(filmId: number, setStatus: SetState<EAuthStatus>, setError: SetState<IHumanError>): TCancelFunction {
  const { token, cancel } = cancelTokenSource();

  // tslint:disable-next-line:no-floating-promises
  (async () => {
    try {
      const payloadPromise = getAuthPayload(token);
      const filmPromise = getData<IGlacier>(API_PATHS.GLACIER.FILM(filmId), token);

      const [decodedPayload, resolvedFilm] = await Promise.all([payloadPromise, filmPromise]);

      const expiry =
        decodedPayload && decodedPayload.glacier && decodedPayload.glacier.auth && decodedPayload.glacier.auth[filmId];

      // Check if user interaction is necessary to unlock the film
      if (typeof expiry === "number" && expiry > Date.now() / 1000) {
        setStatus(EAuthStatus.REQUEST);
      } else if (resolvedFilm.public) {
        setStatus(EAuthStatus.AUTH);
      } else {
        setStatus(EAuthStatus.PROMPT);
      }
    } catch (err) {
      setStatus(EAuthStatus.ERROR);
      setError(humanError(err));
    }
  })();

  return cancel;
}

/** Authorise the film and add its authorisation to the session */
function doAuth(
  filmId: number,
  key: string,
  setStatus: SetState<EAuthStatus>,
  setError: SetState<IHumanError>
): TCancelFunction {
  const { token, cancel } = cancelTokenSource();

  // tslint:disable-next-line no-floating-promises
  (async () => {
    try {
      await authoriseGlacierFilm(filmId, key, token);
      setStatus(EAuthStatus.REQUEST);
    } catch (err) {
      if (err && (err as AxiosError).response.status === 401) {
        // 401 Unauthorised
        setStatus(EAuthStatus.FAILED);
      } else {
        // Unexpected error response
        setStatus(EAuthStatus.ERROR);
        setError(humanError(err));
      }
    }
  })();

  return cancel;
}

/** Request a download/stream token */
function doRequest(
  filmId: number,
  onStatus: SetState<EAuthStatus>,
  setError: SetState<IHumanError>,
  setAuth: SetState<string>
): TCancelFunction {
  const { token, cancel } = cancelTokenSource();

  // tslint:disable-next-line:no-floating-promises
  (async () => {
    try {
      const request = await authoriseGlacierDownload(filmId, token);

      switch (request.status) {
        case EGlacierAuthRequest.ACCEPTED:
          setAuth(request.authorisation);
          onStatus(EAuthStatus.SUCCESS);
          break;
        case EGlacierAuthRequest.EXPIRED:
          setError({
            text: "The session token is expired",
            code: "401 Unauthorised",
            icon: "clock-circle",
          });
          break;
        case EGlacierAuthRequest.NO_AUTH:
          setError({
            text: "The session token was missing correct authorisation",
            code: "NO_AUTH",
            icon: "clock",
          });
          break;
        case EGlacierAuthRequest.REJECTED:
          setError({
            text: "The session token was rejected",
            code: "401 Unauthorised",
            icon: "stop",
          });
          break;
        default:
          setError({
            text: "An unknown error has occurred",
            code: "SWITCH_DEFAULT",
            icon: "stop",
          });
      }
    } catch (err) {
      onStatus(EAuthStatus.ERROR);
      setError(humanError(err));
      return;
    }
  })();

  return cancel;
}
