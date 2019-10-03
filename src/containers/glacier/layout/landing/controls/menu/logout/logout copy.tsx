import { Icon, message, Modal, Tooltip } from "antd";
import moment, { Moment } from "moment";
import React, { FunctionComponent, useEffect, useState } from "react";

import { cancelTokenSource } from "../../../../../../../lib/cancelToken";
import { authLogout, getAuthPayload } from "../../../../../../../services/api/auth";
import { IHumanError } from "../../../../../../../types/app";

export const GlacierMenuLogout: FunctionComponent<{ active?: boolean; onLogout: () => void }> = ({
  active,
  onLogout,
}) => {
  // Handle logout logic
  useEffect(() => {
    if (!active) return;
    const done = message.loading("Ending session...", 0);

    const { token, cancel } = cancelTokenSource();

    // tslint:disable-next-line:no-floating-promises
    (async () => {
      try {
        await authLogout(token);

        onLogout();
        setTimeout(() => message.success("Logged out", 2), 600);
      } catch (err) {
        logoutError(err, onLogout);
      } finally {
        done();
      }
    })();

    return cancel;
  }, [active]);

  return null;
};

function logoutError(err: IHumanError, onLogout: () => void) {
  Modal.error({
    onOk: onLogout,
    content: (
      <>
        <p style={{ textAlign: "center", color: "#FF4136" }}>
          <b>Your session could not be securely ended.</b>
        </p>
        {err && (
          <p style={{ textAlign: "center" }}>
            <Icon type={err.icon} />
            <br />
            {err.text}
            <br />
            <code>{err.code}</code>
          </p>
        )}
        <p>
          Unfortunately this cannot be done automatically. To manually destroy the session, you must{" "}
          <Tooltip
            overlay={
              <>
                Session cookies are restricted to certain paths for additional security and may be hidden from cookie
                viewers.
              </>
            }
          >
            <b>securely</b>
          </Tooltip>{" "}
          clear your cookies for the <code>api.mastermovies.uk</code> domain and close any pages running the Glacier
          app.
        </p>
        <p>
          Session token expiry: <LogoutDuration />
        </p>
      </>
    ),
  });
}

/** Display a handy time-to-logout countdown */
const LogoutDuration: FunctionComponent = () => {
  const [expiry, setExpiry] = useState<Moment>(void 0);
  const [text, setText] = useState<JSX.Element>(<i>Checking...</i>);

  /* Retrieve JWT payload */
  useEffect(() => {
    const { token, cancel } = cancelTokenSource();

    // tslint:disable-next-line:no-floating-promises
    (async () => {
      try {
        const payload = await getAuthPayload(token);
        setExpiry(moment.unix(payload.exp));
      } catch (_err) {
        setText(<i>Unknown</i>);
      }
    })();

    return cancel;
  }, []);

  useEffect(() => {
    if (!expiry) return;

    const interval = setInterval(() => {
      setText(
        <Tooltip overlay={expiry.toString()}>
          <b>{expiry.fromNow()}</b>
        </Tooltip>
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [expiry]);

  return text;
};
