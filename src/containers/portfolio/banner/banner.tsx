import { Icon } from "antd";
import { graphql, useStaticQuery } from "gatsby";
import React, { FunctionComponent } from "react";
import { useInView } from "react-intersection-observer";
import Particles from "react-particles-js";
import Fade from "react-reveal/Fade";
import useViewportSizes from "use-viewport-sizes";

import styles from "./banner.module.css";
import { TextSwitcher } from "./text_switcher";

export const PortfolioBanner: FunctionComponent = () => {
  const { background } = useStaticQuery(
    graphql`
      query {
        background: file(relativePath: { eq: "portfolio/banner.svg" }) {
          publicURL
        }
      }
    `
  );

  const [width, height] = useViewportSizes(200); // 0.2s debounce

  const [ref, inView] = useInView(); // disable particles when not visible

  const density = width >= 768 ? (width >= 1200 ? 800 : 600) : 500;

  return (
    <div className={styles.banner} ref={ref}>
        <Fade>
      {typeof window !== "undefined" && (
          <Particles
            className={styles.particles}
            width={width}
            height={height}
            params={{
              particles: {
                number: {
                  value: 60,
                  density: {
                    enable: true,
                    value_area: density,
                  },
                },
                opacity: {
                  value: 0.5,
                  random: true,
                },
                line_linked: {
                  opacity: 0.2,
                },
                move: {
                  enable: !!inView,
                  speed: 1,
                },
              },
            }}
          />
          )}
        </Fade>

      <div className={styles.background}>
        <Fade delay={200}>
          <img src={background.publicURL} className={styles.backgroundImage} />
        </Fade>
      </div>

      <div className={styles.content}>
        <div className={styles.contentWrapper}>
          <Fade delay={400}>
            <h1 className={styles.title}>
              Hi, I'm <span className={styles.name}>Marcus Cemes</span>
            </h1>
          </Fade>
          <Fade delay={600}>
            <div className={styles.subtitle}>
              I'm <TextSwitcher />
            </div>
          </Fade>
        </div>
      </div>

      <Fade delay={600} mountOnEnter>
        <div>
          <div className={styles.hint}>
            <div className={styles.hintContainer}>
              <span className={styles.hintText}>Scroll down to explore</span>
              <Icon type="down" className={styles.hintIcon} />
            </div>
          </div>
        </div>
      </Fade>
    </div>
  );
};
