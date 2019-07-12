import { navigate } from "gatsby";
import React, { FunctionComponent, useEffect, useState } from "react";
import Helmet from "react-helmet";

import { createCancelToken } from "../../../../../api/common";
import { getFilm, IGlacierFilm } from "../../../../../api/glacier";
import { Modal } from "../../../../../components/common/modal/modal";
import { StandardOverlay } from "../../../../../components/common/standard_overlay";
import { GlacierDownloadOverview } from "./overview/overview";
import { GlacierDownloadWizard } from "./wizard";

interface IGlacierDownloadProps {
  film?: string;
  filmExport?: string;
  onBack: () => any;
}

export const GlacierDownload: FunctionComponent<IGlacierDownloadProps> = ({ film = "", filmExport = "", onBack }) => {

  const [ resolvedFilm, setResolvedFilm ] = useState<IGlacierFilm>(null);
  const [ error, setError ] = useState<{ text: string, error: string }>(null);

  // Resolve film metadata from the API
  useEffect(() => {

    if (!film) {
      setResolvedFilm(null);
      setError(null);
    }

    if (film && !error) {
      let mounted = true;
      const cancelToken = createCancelToken();
      if (error) setError(null);

      getFilm(cancelToken.token, film)
        .then(data => {
          if (mounted) {
            setResolvedFilm(data);
          }
        })
        .catch(err => {
          if (mounted) {
            if (err && err.response && err.response.status === 404) {
              setError({ text: `The film ${film.toUpperCase()} does not exist`, error: "Error: 404 Not Found" });
            } else {
              setError({ text: `Failed to connect to Glacier: ${err.message}`, error: "Error: " + err.message });
            }
          }
        });

      return () => {
        mounted = false;
        cancelToken.cancel();
      }
    }

  }, [ film, error ]);

  const onRetry = () => {
    setError(null);
  }

  return (
    <>
      {!!film && resolvedFilm && <Helmet title={"Download " + resolvedFilm.name + " (" + new Date(resolvedFilm.release).getFullYear() + ") – Glacier"} />}

      <Modal
        active={!!film}
        onBack={(all) => { all || !filmExport? onBack() : navigate("/glacier/film/" + film, {state: {noScroll: true}}) }}
        backText={filmExport? "Back to overview" : "Back to Glacier"}
      >

        {resolvedFilm && (
          <GlacierDownloadOverview
            key={`glacier-overview-${resolvedFilm.fingerprint}`}
            film={resolvedFilm}
            onDownload={(filmExport => navigate(`/glacier/film/${film}/download/${filmExport.fingerprint}`, {state: {noScroll: true}}))}
          />
        )}

        {resolvedFilm && filmExport && (
          <GlacierDownloadWizard
            key={`glacier-download-${filmExport}`}
            film={resolvedFilm}
            filmExport={resolvedFilm? resolvedFilm.exports.find(x => x.fingerprint === filmExport) : null}
            onBack={onBack}
          />
        )}

        {error && (
          <div style={{width: 400, height: 200, maxWidth: "100%", position: "relative" }}>
            <StandardOverlay
              active={true}
              text={error.text}
              icon="exclamation-circle"
              button="Retry"
              code={error.error}
              onButton={onRetry}
            />
          </div>
        )}

      </Modal>
    </>
  );
}
