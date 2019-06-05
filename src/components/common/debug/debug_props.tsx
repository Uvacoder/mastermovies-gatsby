import { Checkbox, Divider, InputNumber } from "antd";
import React, { FunctionComponent, useState } from "react";

import { DebugControlPanel } from "./control_panel";

interface IDebugPropsProps {
  render: (debugProps: any) => any;
  debugProps: {[prop: string]: "string" | "number" | "boolean"};
}


export const DebugProps: FunctionComponent<IDebugPropsProps> = ({ render, debugProps }) => {

  const [ injectedProps, setInjectedProps ] = useState({});
  const [ isolate, setIsolate ] = useState(false);

  return (
    <>
      <DebugControlPanel>
        <h4>Prop Debug</h4>
        Isolate: <Checkbox onChange={e => setIsolate(e.target.checked)} />

        <Divider />

        {
          Object.entries(debugProps).map(([key, value]) => (
            <div key={key}>{key}:&nbsp;
              {
                value === "boolean"?
                <Checkbox onChange={event => setInjectedProps({...injectedProps, [key]: event.target.checked})} />
                : value === "number"?
                  <InputNumber onChange={value => setInjectedProps({...injectedProps, [key]: value})} />
                : <input onChange={event => setInjectedProps({...injectedProps, [key]: event.target.value})} />
              }
            </div>
          ))
        }
      </DebugControlPanel>

      {
        isolate? (
          <div style={{position: "fixed", zIndex: 1000, background: "#FFF", top: 0, left: 0, width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
            {render(injectedProps)}
          </div>
        )
        : render(injectedProps)}
    </>

  );

}