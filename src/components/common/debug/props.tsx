import { Checkbox, Divider, InputNumber } from "antd";
import React, { useState } from "react";
import { Portal } from "../portal";
import { DebugControlPanel } from "./control_panel";
import styles from "./styles.module.css";

interface IDebugPropsProps {
  props: { [prop: string]: "string" | "number" | "boolean" };
}

/**
 * Injects props from a dynamic control panel
 *
 * @example
 * <DebugProps props={{ active: "boolean", value: "string", counter: "number" }}>
 *  <InjectPropsHere>
 *    ...
 *  </InjectPropsHere>
 * </DebugProps>
 */
export const DebugProps: React.FC<IDebugPropsProps> = ({ children, props }) => {
  const [injectedProps, setInjectedProps] = useState({});
  const [isolate, setIsolate] = useState(false);

  const injected = React.Children.map(children, (child) =>
    React.isValidElement(child) ? React.cloneElement(child, injectedProps) : child
  );

  return (
    <>
      <DebugControlPanel>
        <h4>Prop Debug</h4>
        Isolate: <Checkbox onChange={(e) => setIsolate(e.target.checked)} />
        <Divider />
        {Object.entries(props).map(([key, value]) => (
          <div key={key}>
            {key}:&nbsp;
            {value === "boolean" ? (
              <Checkbox onChange={(event) => setInjectedProps({ ...injectedProps, [key]: event.target.checked })} />
            ) : value === "number" ? (
              <InputNumber onChange={(value) => setInjectedProps({ ...injectedProps, [key]: value })} />
            ) : (
              <input onChange={(event) => setInjectedProps({ ...injectedProps, [key]: event.target.value })} />
            )}
          </div>
        ))}
      </DebugControlPanel>

      {isolate ? (
        <Portal>
          <div className={styles.isolate}>{injected}</div>
        </Portal>
      ) : (
        injected
      )}
    </>
  );
};
