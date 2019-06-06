import { Match } from "@reach/router";
import { Dropdown, Icon, Menu } from "antd";
import { navigate } from "gatsby";
import React, { FunctionComponent } from "react";

import { Modal } from "../../../../../components/common/modal/modal";
import { DarkButton } from "../../../../../components/glacier/dark_button";
import styles from "./actions.module.css";
import { GlacierActionsLogout } from "./logout";
import { GlacierActionsStatus } from "./status";


export const GlacierActions: FunctionComponent = () => {

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => navigate("/glacier/status", {state:{noScroll: true}})} className={styles.dropdownItem}>
        <Icon type="safety-certificate" /> View status
      </Menu.Item>
      <Menu.Item key="1" onClick={() => navigate("/glacier/logout", {state:{noScroll: true}})} className={styles.dropdownItem}>
        <Icon type="export" /> Logout
      </Menu.Item>
    </Menu>
  );

  const onBack = () => navigate("/glacier", { replace: true, state: { noScroll: true } });

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']}>
        <DarkButton className={styles.actionButton}><Icon type="idcard" /> MasterMovies ID</DarkButton>
      </Dropdown>

      <Match path="/glacier/status">
        {({ match }) => (
            <Modal active={!!match} onBack={onBack}>
              <GlacierActionsStatus active={!!match} onBack={onBack} />
            </Modal>
        )}
      </Match>

      <Match path="/glacier/logout">
        {({ match }) => (
          <Modal active={!!match} onBack={onBack}>
            <GlacierActionsLogout onBack={onBack} />
          </Modal>
        )}
      </Match>
    </>
  );
}
