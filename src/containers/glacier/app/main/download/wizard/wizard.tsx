import { Button, Descriptions, Icon, Input, Popover, Steps } from "antd";
import classnames from "classnames";
import filesize from "file-size";
import React, { FunctionComponent, useEffect, useState } from "react";
import { Transition, TransitionGroup } from "react-transition-group";

import { authorise, checkAuth } from "../../../../../../api/auth";
import { createCancelToken } from "../../../../../../api/common";
import { IGlacierFilm, IGlacierFilmExport } from "../../../../../../api/glacier";
import { SummaryTitle } from "../common/summary";
import styles from "./wizard.module.css";

interface iGlacierDownloadWizardProps {
  film?: IGlacierFilm;
  filmExport?: IGlacierFilmExport;
  onBack?: () => any;
}

const [ IDLE, PREPARE, LOGIN, AUTHORISE, READY, DOWNLOAD, DONE ] = [ 0, 1, 2, 3, 4, 5, 6 ];


export const GlacierDownloadWizard: FunctionComponent<iGlacierDownloadWizardProps> = ({ film, filmExport, onBack }) => {

  const [ authStage, setAuthStage ] = useState<number>(IDLE);
  const [ error, setError ] = useState<string | true>(null);
  const [ key, setKey ] = useState<string>("");
  const [ lockout, setLockout ] = useState<number>(null);

  // Start the authorization process
  useEffect(() => {
    if (filmExport) {
      setAuthStage(PREPARE);
      setError(null);
    } else {
      if (authStage !== IDLE) setAuthStage(IDLE);
    }
  }, [ filmExport ]);

  // Handle 429 lockout
  useEffect(() => {
    if (typeof lockout === "number") {
      const timeout = setTimeout(() => setLockout(null), lockout);
      return () => clearTimeout(timeout);
    }
  }, [ lockout ]);

  // Handle the main download logic
  useEffect(() => {
    switch (authStage) {
      case PREPARE:
        const queryCancelToken = createCancelToken();
        checkAuth(queryCancelToken.token, film.fingerprint)
          .then(auth => {
            if (!auth && film.restricted) {
              setAuthStage(LOGIN);  // go to authorization
            } else {
              setAuthStage(READY);  // skip authorization
            }
          })
          .catch(err => setError("Unable to reach Glacier: " + err.message));
        return () => queryCancelToken.cancel();
      case AUTHORISE:
        const authCancelToken = createCancelToken();
        setError(null);
        authorise(authCancelToken.token, film.fingerprint, key)
          .then(() => setAuthStage(READY))
          .catch(err => {
            let customErrorMessage = false;
            if (err.response && err.response.status) {
              if (err.response.status === 429) {
                setError("Too many attempts, try again in a few minutes");
                setLockout(1000 * 60 * 10); // TODO wait 10 minutes
                customErrorMessage = true;
              } else if (err.response.status === 403) {
                setError("Invalid download key")
                customErrorMessage = true;
              }
            }
            if (!customErrorMessage) setError("Unknown error: " + err.message);
            setAuthStage(LOGIN);
            setKey("");
          });
        return () => authCancelToken.cancel();
      case DOWNLOAD:
        const element = document.createElement('a');
        element.setAttribute("href", `https://api.mastermovies.uk/v2/glacier/film/${film.fingerprint}/export/${filmExport.fingerprint}?download`);
        element.setAttribute("download", "");
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        const timeout = setTimeout(() => setAuthStage(DONE), 1000);
        return () => clearTimeout(timeout);
    }
  }, [ authStage ])

  const { Item } = Descriptions;

  return (
    <TransitionGroup component={null}>
      {!!filmExport && (
        <Transition unmountOnExit timeout={{ enter: 0, exit: 400 }}>
          {state => (
            <div className={classnames(styles.authorize, {[styles.enter]: state === "entered"})}>

              <SummaryTitle className={styles.title} title={film.name} release={film.release} />

              <span className={styles.subtitle}>Download information</span>

              <Descriptions column={2} className={styles.description}>
                <Item label="Fingerprint"><>{filmExport.fingerprint.toUpperCase()}</></Item>
                <Item label="Size">
                  <>
                    {typeof filmExport.size === "number"?
                    filesize(filmExport.size).human("si")
                    : filesize(parseInt(filmExport.size)).human("si")}
                  </>
                </Item>
                <Item label="Resolution"><>{`${filmExport.width}x${filmExport.height}`}</></Item>
                <Item label="Codec"><>{`${filmExport.video_codec} / ${filmExport.audio_codec}`}</></Item>
              </Descriptions>

              <DownloadSteps authStage={authStage} error={error !== null} />

              <div className={styles.actions}>
                {authStage === PREPARE && (
                  <span>Fetching download information...</span>
                ) || authStage === LOGIN && (
                  <>
                    <span className={styles.actionsTitle}>
                      A download key is required
                      <Popover overlayStyle={{ width: 400, maxWidth: "100vw" }} content={
                        <span>
                          <p>
                            For the protection of its participants, some films are restricted to a certain audience.
                            These films require an additional authorisation step to prove that the user is permitted to access the resource.
                          </p>
                          <p>
                            Download keys provide a simple way to share access to films, and must be obtained from the film owner.
                          </p>
                          </span>
                        } title={<><Icon type="lock" /> Film protection</>}>
                        <Icon type="question-circle" style={{marginLeft: 4, fontSize: 12}} />
                      </Popover>
                    </span>

                    <div className={styles.form}>
                      <Input.Password type="password" onChange={value => setKey(value.target.value)} />
                      <Button className={styles.formButton} disabled={lockout !== null || key.length === 0} type="primary" onClick={() => setAuthStage(AUTHORISE)}>Unlock</Button>
                    </div>
                  </>
                ) || authStage === AUTHORISE && (
                  <span style={{userSelect: "none", fontSize: "0.9rem"}}>
                    Authorising download...
                  </span>
                ) || (authStage === READY || authStage === DOWNLOAD) && (
                  <>
                  <span className={styles.actionsTitle}>Your download is ready</span>
                  <Button type="primary" loading={authStage === DOWNLOAD} onClick={() => setAuthStage(DOWNLOAD)}>Download</Button>
                  </>
                ) || authStage === DONE && (
                  <>
                    <span className={styles.actionsTitle}>
                      <Icon type="check" style={{color: "#2ECC40", marginRight: 4}} /> Your download has started
                    </span>
                    <Button onClick={onBack}>Back to Glacier</Button>
                  </>
                )}
                {error? <span className={styles.error}>{typeof error === "string"? error : "An unknown error occurred"}</span> : null}

              </div>
            </div>
          )}
        </Transition>
      )}
    </TransitionGroup>
  );

}

const [ WAIT, PROCESS, FINISHED ] = [ -1, 0, 1 ];
const statusMap: {[index: number]: "wait" | "process" | "finish"} = { [WAIT]: "wait", [PROCESS]: "process", [FINISHED]: "finish" };

const steps = [
  {
    title: "Prepare",
    status: x => x < PREPARE? WAIT : x > PREPARE? FINISHED : PROCESS,
    icon: x => x === PREPARE? "loading" : "cloud-sync"
  },
  {
    title: "Authorise",
    status: x => x < LOGIN? WAIT : x > READY? FINISHED : PROCESS,
    icon: x => x === AUTHORISE? "loading" : "user"
  },
  {
    title: "Download",
    status: x => x < DOWNLOAD? WAIT : x > DOWNLOAD? FINISHED : PROCESS,
    icon: x => x === DOWNLOAD? "loading" : "cloud-download"
  }
];

const DownloadSteps: FunctionComponent<{ authStage: number, error: boolean }> = ({ authStage, error }) => (
  <Steps className={styles.steps} >
    {steps.map(step => (
      <Steps.Step
        key={step.title}
        status={step.status(authStage) === PROCESS && error? "error" : statusMap[step.status(authStage)] }
        title={step.title}
        icon={<Icon type={step.status(authStage) === PROCESS && error? "exclamation-circle" : step.icon(authStage)} />}
      />
    ))}
  </Steps>
)