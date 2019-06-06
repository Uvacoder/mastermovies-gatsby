import React, { FunctionComponent, useEffect, useState } from "react";

import { createCancelToken } from "../../../../../api/common";
import { getFilm, IGlacierFilm, IGlacierFilmExport } from "../../../../../api/glacier";
import { Modal } from "../../../../../components/common/modal/modal";
import { GlacierDownloadOverview } from "./overview/overview";
import { GlacierDownloadWizard } from "./wizard";
import Helmet from "react-helmet";

interface IGlacierDownloadProps {
  film?: string;
  onBack: () => any;
}

export const GlacierDownload: FunctionComponent<IGlacierDownloadProps> = ({ film = "", onBack }) => {

  const [ active, setActive ] = useState<boolean>(false);
  const [ resolvedFilm, setResolvedFilm ] = useState<IGlacierFilm>(null);
  const [ error, setError ] = useState<string>(null);

  const [ download, setDownload ] = useState<IGlacierFilmExport>(null);

  // Resolve film metadata from the API
  useEffect(() => {

    // Exit transition
    if (film === "") {
      if (active) setActive(false);
      if (resolvedFilm !== null) setResolvedFilm(null);
      if (download !== null) setDownload(null);
      if (error !== null) setError(null);
      return;
    }

    if (film) {
      let mounted = true;
      const cancelToken = createCancelToken();
      if (error) setError(null);

      getFilm(cancelToken.token, film)
        .then(data => {
          if (mounted) {
            setResolvedFilm(data);
            setActive(true);
          }
        })
        .catch(err => {
          if (mounted) {
            setError(`Failed to connect to Glacier: ${err.message}`);
            setActive(true);
          }
        });

      return () => {
        mounted = false;
        cancelToken.cancel();
      }
    }

  }, [ film ]);

  return (
    <>
      {!!film && resolvedFilm && <Helmet title={"Download " + resolvedFilm.name + " (" + new Date(resolvedFilm.release).getFullYear() + ") – Glacier"} />}

      <Modal
        active={!!film}
        onBack={(all) => { all || !download? onBack() : setDownload(null) }}
        backText={download? "Back to overview" : "Back to Glacier"}
      >

        {resolvedFilm && !download && (
          <GlacierDownloadOverview
            key={`glacier-overview-${resolvedFilm.fingerprint}`}
            film={resolvedFilm}
            onDownload={setDownload}
          />
        )}

        {download && (
          <GlacierDownloadWizard
            key={`glacier-download-${download.fingerprint}`}
            film={resolvedFilm}
            filmExport={download}
            onBack={onBack}
          />
        )}

      </Modal>
    </>
  );
}
