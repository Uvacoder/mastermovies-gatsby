import classnames from "classnames";
import React, { FunctionComponent, useEffect, useState } from "react";

import { GlacierLogo } from "../../../../components/glacier/logo";
import styles from "./intro.module.css";

interface IGlacierIntroProps {
  onComplete: () => any;
}

export const GlacierIntro: FunctionComponent<IGlacierIntroProps> = ({ onComplete }) => {

  const [ enter, setEnter ] = useState<boolean>(false);
  const [ leave, setLeave ] = useState<boolean>(false);
  const [ mounted, setMounted ] = useState<boolean>(true);

  const delayedEffects: Array<[() => any, number]> = [
    [() => setEnter(true), 200],
    [() => setLeave(true), 1500],
    [() => onComplete(), 200],
    [() => setMounted(false), 2500]
  ]

  // Create timeouts for each effect
  useEffect(() => {
    let time = 0;
    const timeouts = delayedEffects.map(effect => setTimeout(effect[0], time += effect[1]));
    return () => timeouts.forEach(clearTimeout);
  }, []);

  if (!mounted) return null;

  return (
    <div className={classnames(styles.container, {[styles.exit]: leave})}>

      <GlacierLogo
        theme="dark"
        className={classnames(styles.logo, {
          [styles.enter]: enter,
          [styles.exit]: leave
        })}
      />

      <span className={classnames(styles.snow, {
              [styles.enter]: enter,
              [styles.exit]: leave
      })}>
      </span>

    </div>
  );
};
