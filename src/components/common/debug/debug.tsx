import { Checkbox, Divider } from "antd";
import React, { FunctionComponent, useState } from "react";

interface IDebugProps {
  render: (debugProps: any) => any;
  debugProps: {[prop: string]: "string" | "boolean"};
}


export const Debug: FunctionComponent<IDebugProps> = ({render, debugProps}) => {

  const [ injectedProps, setInjectedProps ] = useState({});
  const [ isolate, setIsolate ] = useState(false);

  return (
    <>
      <div style={{position: "fixed", zIndex: 1001, bottom: 32, right: 32, width: 200, background: "#FFF", border: "1px solid #AAA", padding: "32px 16px"}}>

        <h4>React Props Debugger</h4>
        <br />
        Isolate: <Checkbox onChange={e => setIsolate(e.target.checked)} />

        <Divider />

        {
          Object.entries(debugProps).map(([key, value]) => (
            <div key={key}>{key}:&nbsp;
              {
                value === "boolean"?
                <Checkbox onChange={event => setInjectedProps({...injectedProps, [key]: event.target.checked})} />
                : <input onChange={event => setInjectedProps({...injectedProps, [key]: event.target.value})} />
              }
            </div>
          ))
        }
      </div>

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