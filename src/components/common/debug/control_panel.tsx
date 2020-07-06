import React from "react";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import { Portal } from "../portal";
import styles from "./styles.module.css";

export const DebugControlPanel: React.FC = ({ children }) => {
  const [{ offset }, set] = useSpring(() => ({ offset: [0, 0], immediate: true }));
  const bind = useDrag(({ offset }) => set({ offset }));

  return (
    <Portal>
      <animated.div
        {...bind()}
        className={styles.controlPanel}
        style={{
          transform: offset.interpolate((x, y) => `translate3d(${x}px,${y}px,0)`),
        }}
      >
        {children}
      </animated.div>
    </Portal>
  );
};
