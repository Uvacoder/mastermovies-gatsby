import React from "react";
import { AnimatedStyle } from "../../../../components/common/animated_style";
import { GlacierText, MasterMoviesText } from "../../../../components/common/logos";
import styles from "./intro.module.css";

export const GlacierIntro: React.FC<{ active: boolean }> = ({ active }) => (
  <div className={styles.root}>
    <AnimatedStyle from={{ opacity: 0 }} to={{ opacity: active ? 1 : 0 }} delay={active ? 200 : 0}>
      <span className={styles.logo}>
        <GlacierText />
      </span>
    </AnimatedStyle>

    <AnimatedStyle from={{ opacity: 0 }} to={{ opacity: active ? 1 : 0 }} delay={active ? 600 : 200}>
      <span className={styles.subtitle}>
        powered by <MasterMoviesText />
      </span>
    </AnimatedStyle>
  </div>
);
