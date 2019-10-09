import { AxiosError } from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";

import { IconMargin } from "../../../../../components/common/icon_margin";
import { Underline } from "../../../../../components/common/underline";
import { cancelTokenSource } from "../../../../../lib/cancelToken";
import { getAuthPayload } from "../../../../../services/api/auth";
import { humanError } from "../../../../../services/api/error";
import { authoriseGlacierDownload, authoriseGlacierFilm, EGlacierAuthState } from "../../../../../services/api/glacier";
import { getData } from "../../../../../services/api/request";
import { API_PATHS } from "../../../../../services/api/routes";
import { IHumanError } from "../../../../../types/app";
import { IGlacier } from "../../../../../types/glacier";
import styles from "./auth.module.css";
import { GlacierAuthComponent } from "./components";

interface IAuthProps {
  filmId?: number;
  status: EAuthStatus;
  onStatus: (newStatus: EAuthStatus) => void;
  // Returns the obtained download token
  onDownloadToken: (downloadToken: string) => void;
}

export enum EAuthStatus {
  READY,
  QUERY,
  PROMPT,
  AUTH,
  REQUEST,
  SUCCESS,
  FAILED,
  ERROR,
}

/** A film authorisation component. Provides UI and authorisation logic to authorise Glacier film downloads */
export const GlacierDownloadAuth: FunctionComponent<IAuthProps> = ({ filmId, status, onStatus, onDownloadToken }) => {
  const [film, setFilm] = useState<number>(void 0); // The film being authorised
  const [key, setKey] = useState<string>(void 0);
  const [error, setError] = useState<IHumanError>(void 0);

  // Reset if the film id changes
  useEffect(() => {
    if (filmId !== film) {
      setKey(void 0);
      setError(void 0);
      setFilm(filmId);

      if (typeof filmId === "number") {
        onStatus(EAuthStatus.QUERY);
      } else {
        onStatus(EAuthStatus.READY);
      }
    }
  }, [filmId]);

  // Main authorisation logic
  useEffect(() => {
    switch (status) {
      // Retrieve authorisation info from the API
      case EAuthStatus.QUERY: {
        const { token, cancel } = cancelTokenSource();

        // tslint:disable-next-line:no-floating-promises
        (async () => {
          try {
            const payloadPromise = getAuthPayload(token);
            const filmPromise = getData<IGlacier>(API_PATHS.GLACIER.FILM(film), token);

            const [decodedPayload, resolvedFilm] = await Promise.all([payloadPromise, filmPromise]);

            const expiry =
              decodedPayload &&
              decodedPayload.glacier &&
              decodedPayload.glacier.auth &&
              decodedPayload.glacier.auth[film];

            // Check if user interaction is necessary to unlock the film
            if (typeof expiry === "number" && expiry > Date.now() / 1000) {
              onStatus(EAuthStatus.REQUEST);
            } else if (resolvedFilm.public) {
              onStatus(EAuthStatus.AUTH);
            } else {
              onStatus(EAuthStatus.PROMPT);
            }
          } catch (err) {
            onStatus(EAuthStatus.ERROR);
            setError(humanError(err));
          }
        })();

        return cancel;
      }

      // Authorise the film from the Auth API
      case EAuthStatus.AUTH: {
        const { token, cancel } = cancelTokenSource();

        // tslint:disable-next-line no-floating-promises
        (async () => {
          try {
            await authoriseGlacierFilm(film, key, token);
            onStatus(EAuthStatus.REQUEST);
          } catch (err) {
            if (err && (err as AxiosError).response.status === 401) {
              // 401 Unauthorised
              onStatus(EAuthStatus.FAILED);
            } else {
              // Unexpected error response
              onStatus(EAuthStatus.ERROR);
              setError(humanError(err));
            }
          }
        })();

        return cancel;
      }

      // Request a download token
      case EAuthStatus.REQUEST: {
        const { token, cancel } = cancelTokenSource();

        // tslint:disable-next-line:no-floating-promises
        (async () => {
          try {
            const request = await authoriseGlacierDownload(film, token);

            switch (request.status) {
              case EGlacierAuthState.ACCEPTED:
                onDownloadToken(request.authorisation);
                onStatus(EAuthStatus.SUCCESS);
                break;
              case EGlacierAuthState.EXPIRED:
                setError({
                  text: "The session token is expired",
                  code: "401 Unauthorised",
                  icon: "clock-circle",
                });
                break;
              case EGlacierAuthState.NO_AUTH:
                setError({
                  text: "The session token was missing correct authorisation",
                  code: "NO_AUTH",
                  icon: "clock",
                });
                break;
              case EGlacierAuthState.REJECTED:
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
    }
  }, [status]);

  const onSubmit = (pass: string) => {
    setKey(pass);
    onStatus(EAuthStatus.AUTH);
  };

  const component =
    status === EAuthStatus.READY ? (
      <GlacierAuthComponent.Ready key="ready" />
    ) : status === EAuthStatus.QUERY ? (
      <GlacierAuthComponent.Query key="query" />
    ) : status === EAuthStatus.PROMPT ? (
      <GlacierAuthComponent.Prompt key="prompt" onSubmit={onSubmit} />
    ) : status === EAuthStatus.AUTH || status === EAuthStatus.REQUEST ? (
      <GlacierAuthComponent.Auth key="auth" />
    ) : status === EAuthStatus.SUCCESS ? (
      <GlacierAuthComponent.Success key="success" />
    ) : status === EAuthStatus.FAILED ? (
      <GlacierAuthComponent.Prompt key="failed" failed onSubmit={onSubmit} />
    ) : (
      <GlacierAuthComponent.Error key="error" error={error} onRetry={() => onStatus(EAuthStatus.QUERY)} />
    );

  return (
    <div className={styles.auth}>
      <div className={styles.authBadge}>
        <IconMargin type="safety-certificate" marginRight="0.3em" />
        <Underline thin>MasterMovies ID</Underline>
      </div>
      <div className={styles.authStatus}>{component}</div>
    </div>
  );
};
