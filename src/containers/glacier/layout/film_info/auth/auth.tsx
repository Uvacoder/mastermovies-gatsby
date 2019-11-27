import React, { FunctionComponent, useEffect } from "react";

import { IconMargin } from "../../../../../components/common/icon_margin";
import { Underline } from "../../../../../components/common/underline";
import { EAuthStatus, useGlacierAuth } from "../../../../../hooks/api/glacier_auth";
import styles from "./auth.module.css";
import { GlacierAuthComponent } from "./components";

interface IAuthProps {
  filmId?: number;
  // Returns the obtained download token
  onAuth: (authToken: string) => void;
}

/** A film authorisation component. Provides UI and authorisation logic to authorise Glacier film downloads */
export const GlacierDownloadAuth: FunctionComponent<IAuthProps> = ({ filmId, onAuth }) => {
  const [status, auth, setKey, error, retry] = useGlacierAuth(filmId);

  const onSubmit = (pass: string) => {
    setKey(pass);
  };

  // Notify parent
  useEffect(() => {
    if (status === EAuthStatus.SUCCESS) onAuth(auth);
  }, [status]);

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
      <GlacierAuthComponent.Error key="error" error={error} onRetry={retry} />
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
