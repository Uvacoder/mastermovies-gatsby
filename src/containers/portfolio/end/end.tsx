import React, { FunctionComponent } from "react";
import { Fade } from "react-reveal";

import { PortfolioSection } from "../../../components/portfolio/section";
import styles from "./end.module.css";

export const PortfolioEnd: FunctionComponent = () => (
  <PortfolioSection className={styles.end} separate>
    <Fade delay={1000}>
      <span>This is the end of this page</span>
    </Fade>
    <Fade delay={3000}>
      <span>, but not the end of my endeavours.</span>
    </Fade>
  </PortfolioSection>
);
