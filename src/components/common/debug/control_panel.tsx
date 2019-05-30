import React, { FunctionComponent } from "react";
import { animated, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";

export const DebugControlPanel: FunctionComponent = ({ children }) => {

  const [{ local }, set] = useSpring(() => ({ local: [0, 0], immediate: true }));
  const bind = useGesture({ onDrag: ({ local }) => set({ local })});

  return (
    <animated.div {...bind()} style={{
      position: "fixed",
      zIndex: 1001,
      bottom: 32,
      right: 32,
      //@ts-ignore bad typings
      transform: local.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`),
      width: 200,
      background: "#FFF",
      border: "1px solid #AAA",
      padding: "28px 16px 32px 16px",
      userSelect: "none",
      cursor: "grab"
      }}>
        {children}
    </animated.div>
  );
}