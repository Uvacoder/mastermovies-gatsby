import classnames from "classnames";
import React, { FunctionComponent, useEffect, useState } from "react";
import { SwitchTransition, Transition } from "react-transition-group";

import styles from "./text_switcher.module.css";

const TEXTS = [
  "a programmer.",
  "a filmmaker.",
  "a photographer.",
  "a student.",
  "a human being.",
  "a website designer.",
  "an IT geek.",
];

export const TextSwitcher: FunctionComponent = () => {
  const [index, setIndex] = useState<number>(null);

  useEffect(() => {
    let effectIndex = Math.floor(Math.random() * TEXTS.length);
    setIndex(effectIndex);

    const next = () => {
      effectIndex = (effectIndex + 1) % TEXTS.length;
      setIndex(effectIndex);
    };

    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.placeholder}>
      <SwitchTransition>
        {typeof index === "number" ? (
          <Transition timeout={{ enter: 1000, exit: 500 }} key={"text-" + String(index)}>
            {state => (
              <span
                className={classnames(styles.text, {
                  [styles.enter]: state === "entering" || state === "entered",
                  [styles.exit]: state === "exiting" || state === "exited",
                })}
              >
                {TEXTS[index]}
              </span>
            )}
          </Transition>
        ) : (
          <Transition timeout={0}>
            <div />
          </Transition>
        )}
      </SwitchTransition>
    </div>
  );
};
