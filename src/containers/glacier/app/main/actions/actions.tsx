import { Match } from "@reach/router";
import { Dropdown, Icon, Menu } from "antd";
import { navigate } from "gatsby";
import React, { FunctionComponent } from "react";
import Helmet from "react-helmet";

import { Modal } from "../../../../../components/common/modal/modal";
import { DarkButton } from "../../../../../components/glacier/dark_button";
import { GlacierActionsAbout } from "./about";
import styles from "./actions.module.css";
import { GlacierActionsLogout } from "./logout";
import { GlacierActionsStatus } from "./status";


export const GlacierActions: FunctionComponent = () => {

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => navigate("/glacier/about", {state:{noScroll: true}})} className={styles.dropdownItem}>
        <Icon type="info-circle" /> About Glacier
      </Menu.Item>
      <Menu.Item key="1" onClick={() => navigate("/glacier/status", {state:{noScroll: true}})} className={styles.dropdownItem}>
        <Icon type="credit-card" /> View authorizations
      </Menu.Item>
      <Menu.Item key="2" onClick={() => navigate("/glacier/logout", {state:{noScroll: true}})} className={styles.dropdownItem}>
        <Icon type="export" /> End session
      </Menu.Item>
    </Menu>
  );

  const onBack = () => navigate("/glacier", { replace: true, state: { noScroll: true } });

  return (
    <>
      <Dropdown overlay={menu} trigger={['click']} placement="bottomCenter">
        <DarkButton className={styles.actionButton}><Icon type="appstore" /> Actions</DarkButton>
      </Dropdown>

      <Match path="/glacier/about">
        {({ match }) => (
          <>
            {!!match && <Helmet title="About – Glacier" />}
            <Modal active={!!match} onBack={onBack}>
              <GlacierActionsAbout />
            </Modal>
          </>
        )}
      </Match>

      <Match path="/glacier/status">
        {({ match }) => (
          <>
            {!!match && <Helmet title="Status – Glacier" />}
            <Modal active={!!match} onBack={onBack}>
              <GlacierActionsStatus active={!!match} />
            </Modal>
          </>
        )}
      </Match>

      <Match path="/glacier/logout">
        {({ match }) => (
          <>
            {!!match && <Helmet title="Logout – Glacier" />}
            <Modal active={!!match} onBack={onBack}>
              <GlacierActionsLogout onBack={onBack} />
            </Modal>
          </>
        )}
      </Match>
    </>
  );
}
