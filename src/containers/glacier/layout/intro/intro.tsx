import React, { FunctionComponent } from "react";

import { AnimatedStyle } from "../../../../components/common/animated_style";
import { GlacierLogo, MasterMoviesLogo } from "../../../../components/common/logos";
import styles from "./intro.module.css";

export const GlacierIntro: FunctionComponent<{ active: boolean }> = ({ active }) => (
  <div className={styles.root}>
    <AnimatedStyle from={{ opacity: 0 }} to={{ opacity: active ? 1 : 0 }} delay={active ? 200 : 0}>
      <span className={styles.logo}>
        <GlacierLogo />
      </span>
    </AnimatedStyle>

    <AnimatedStyle from={{ opacity: 0 }} to={{ opacity: active ? 1 : 0 }} delay={active ? 600 : 200}>
      <span className={styles.subtitle}>
        powered by <MasterMoviesLogo />
      </span>
    </AnimatedStyle>
  </div>
);
