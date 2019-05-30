import { Divider, Menu, Dropdown, Icon, Button } from "antd";
import React, { FunctionComponent, ReactNode, useState } from "react";

import { DebugControlPanel } from "./control_panel";

interface IDebugSwitchProps {
  components: {
    [index: string]: () => ReactNode
  }
}


export const DebugSwitch: FunctionComponent<IDebugSwitchProps> = ({ components }) => {

  const [ key, setKey ] = useState<string>(null);

  if (key === null && Object.values(components).length > 0) {
    setKey(Object.keys(components)[0]);
  }

  const onClick = ({ key }) => {
    setKey(key);
  };

  return (
    <>
      <DebugControlPanel>
        <h4>Debug Switch</h4>
        <Divider />

        <Dropdown overlay={(
          <Menu onClick={onClick}>
            {Object.keys(components).map((key) => <Menu.Item key={key}>{key}</Menu.Item> )}
          </Menu>
        )}>
          <Button type="primary" style={{left: "50%", transform: "translateX(-50%)"}}>Swap Element <Icon type="down" /></Button>
        </Dropdown>

      </DebugControlPanel>

      {typeof components[key] === "function"? components[key]() : components[key] || null}
    </>

  );

}