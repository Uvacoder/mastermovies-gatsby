import { Dropdown, Menu } from "antd";
import React, { FunctionComponent, useState } from "react";

import { IconMargin } from "../../../../../../components/common/icon_margin";
import { DarkButton } from "../../../../../../components/glacier/dark_button";
import { GlacierMenuAbout } from "./about";
import { GlacierMenuAuths } from "./auths";
import { GlacierMenuHelp } from "./help";
import { GlacierMenuLogout } from "./logout";
import styles from "./menu.module.css";

export const GlacierMenu: FunctionComponent = () => {
  const [viewAuth, setViewAuth] = useState<boolean>(false);
  const [viewAbout, setViewAbout] = useState<boolean>(false);
  const [viewHelp, setViewHelp] = useState<boolean>(false);
  const [logout, setLogout] = useState<boolean>(false);

  return (
    <div className={styles.menu}>
      <Dropdown
        trigger={["click"]}
        overlay={
          <Menu>
            <Menu.Item onClick={() => setViewAuth(true)}>
              <IconMargin type="idcard" marginRight /> My authorisations
            </Menu.Item>
            <Menu.Item onClick={() => setViewAbout(true)}>
              <IconMargin type="read" marginRight /> About
            </Menu.Item>
            <Menu.Item onClick={() => setViewHelp(true)}>
              <IconMargin type="question-circle" marginRight /> Help
            </Menu.Item>
            <Menu.Item onClick={() => setLogout(true)}>
              <IconMargin type="logout" marginRight /> Logout
            </Menu.Item>
          </Menu>
        }
      >
        <DarkButton large>
          <IconMargin type="appstore" marginRight={8} />
          Menu
        </DarkButton>
      </Dropdown>

      <GlacierMenuAuths active={viewAuth} onActive={setViewAuth} />
      <GlacierMenuAbout active={viewAbout} onActive={setViewAbout} />
      <GlacierMenuHelp active={viewHelp} onActive={setViewHelp} />
      <GlacierMenuLogout active={logout} onActive={setLogout} />
    </div>
  );
};
