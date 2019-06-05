import { Match, NavigateFn } from "@reach/router";
import { Dropdown, Icon, Menu } from "antd";
import React, { FunctionComponent } from "react";

import { Modal } from "../../../../../components/common/modal/modal";
import { DarkButton } from "../../../../../components/glacier/dark_button";
import styles from "./actions.module.css";
import { GlacierActionsLogout } from "./logout";
import { GlacierActionsStatus } from "./status";

interface IGlacierActionsProps {
  navigate: NavigateFn;
}

export const GlacierActions: FunctionComponent<IGlacierActionsProps> = ({ navigate }) => {

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => navigate("/glacier/status")} className={styles.dropdownItem}>
        <Icon type="safety-certificate" /> View status
      </Menu.Item>
      <Menu.Item key="1" onClick={() => navigate("/glacier/logout")} className={styles.dropdownItem}>
        <Icon type="export" /> Logout
      </Menu.Item>
    </Menu>
  );

  const onBack = () => navigate("/glacier", { replace: true });

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
