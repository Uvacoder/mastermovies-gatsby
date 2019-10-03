import { Icon } from "antd";
import { Link } from "gatsby";
import React, { FunctionComponent } from "react";

import { Modal } from "../../../../../../../components/common/modal";
import { Portal } from "../../../../../../../components/common/portal";
import styles from "./help.module.css";

export const GlacierMenuHelp: FunctionComponent<{
  active?: boolean;
  onActive: (active: boolean) => void;
}> = ({ active, onActive }) => (
  <Portal>
    <Modal active={active} onBack={() => onActive(false)} backText="Back to Glacier">
      <div className={styles.helpModal}>
        <h3>How do I download a film?</h3>
        <p>
          After you have selected the desired film to download, you will be presented with a page containing information
          about the film. At the bottom, there is a choice of different quality exports. Select the one that is best
          suited to you, and proceed to authorise the film. Please note that some films require access-key based
          authorisation and are not available to any every audience.
        </p>

        <h3>Film Access</h3>
        <p>
          To protect the privacy of its participants, some films are restricted to a select viewing audience. These
          films are marked with a <Icon type="lock" /> "Restricted" icon and may only be viewed by people in possession
          of a valid access key.
        </p>

        <h3>Request an access key</h3>
        <p>
          If you were involved in the making of the film, or were participating in one of the featured events, you may
          request an access key by using the <Link to="/contact">contact form</Link> to get in touch the producer of the
          film.
        </p>

        <h3>Download Authorisation</h3>
        <p>
          Once a download is authorised, a unique download token is generated. This token is valid for 24 hours and is
          uniquely tied to the download. If you logout, you will no longer be able to request a new download, however
          any authorised downloads that are still running will remain unaffected.
        </p>
      </div>
    </Modal>
  </Portal>
);
