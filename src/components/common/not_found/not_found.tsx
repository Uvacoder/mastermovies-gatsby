import { Button, Icon } from "antd";
import classnames from "classnames";
import { Link } from "gatsby";
import React, { FunctionComponent, useEffect } from "react";
import { animated, useTrail } from "react-spring";

import { SEO } from "../seo";
import styles from "./not_found.module.css";

interface INotFoundProps {
  buttonLink?: string;
  title?: string;
  titleClass?: string;
  titleLink?: string;
  theme?: "dark" | "light";
}

export const NotFound: FunctionComponent<INotFoundProps> = ({
  buttonLink = "/",
  title = "MasterMovies",
  titleClass,
  titleLink = "/",
  theme = "light",
}) => {
  const [trail, set] = useTrail(6, () => ({ opacity: 0 }));
  useEffect(() => {
    // @ts-ignore Bad typings for react-spring
    set({ opacity: 1 });
  }, []);

  return (
    <>
      <SEO title="Whoops... Where's that?" keywords={["MasterMovies"]} />
      <div className={styles.root} data-dark={theme === "dark" ? "" : void 0}>
        <div className={styles.container}>
          <Link to={titleLink}>
            <animated.h4
              style={trail[0]}
              className={classnames(styles.title, titleClass)}
            >
              {title}
            </animated.h4>
          </Link>

          <animated.h1 style={trail[1]} className={styles.text}>
            <Icon type="warning" /> Warning <Icon type="warning" />
          </animated.h1>

          <animated.h3 style={trail[2]} className={styles.text}>
            You tried to access something that doesn't exist!
          </animated.h3>

          <animated.p style={trail[3]} className={styles.text}>
            <b>Don't panic!</b> We intercepted the request and destroyed it
            before it could create a hole in the space-time continuum. You're
            welcome <Icon type="smile" />
          </animated.p>

          <animated.p
            style={trail[4]}
            className={classnames(styles.text, styles.fadedText)}
          >
            That does mean we don't have anything to show you.
            <br />
            Here's a handy button to get you out of here:
          </animated.p>

          <animated.p style={trail[5]} className={styles.text}>
            <Link to={buttonLink}>
              <Button className={styles.button} type="primary">
                Get me out of here!
              </Button>
            </Link>
          </animated.p>
        </div>
      </div>
    </>
  );
};
