import { Button, Icon } from "antd";
import classnames from "classnames";
import { Link } from "gatsby";
import React, { FunctionComponent, ReactNode, useContext } from "react";
import { Fade } from "react-reveal";

import { ThemeContext } from "../../../hooks/theme";
import { MasterMoviesLogo } from "../logos";
import { SEO } from "../seo";
import styles from "./not_found.module.css";

interface INotFoundProps {
  buttonLink?: string;
  logo?: ReactNode;
}

export const NotFound: FunctionComponent<INotFoundProps> = ({ buttonLink = "/", logo = <MasterMoviesLogo /> }) => {
  const theme = useContext(ThemeContext);

  let lastDelay = 50;
  const delay = () => (lastDelay += 75);

  return (
    <>
      <SEO title="Whoops... Where's that?" keywords={["MasterMovies"]} />
      <div className={classnames(styles.notFound, { [styles.dark]: theme === "dark" })}>
        <div className={styles.container}>
          <Fade delay={delay()}>
            <span className={styles.logo}>{logo}</span>
          </Fade>

          <Fade delay={delay()}>
            <h1>
              <Icon type="warning" /> Warning <Icon type="warning" />
            </h1>
          </Fade>

          <Fade delay={delay()}>
            <h3>You tried to access something that doesn't exist!</h3>
          </Fade>

          <Fade delay={delay()}>
            <p>
              <b>Don't panic!</b> We intercepted the request and destroyed it before it could create a hole in the
              space-time continuum. You're welcome <Icon type="smile" />
            </p>
          </Fade>

          <Fade delay={delay()}>
            <p>
              That does mean we don't have anything to show you.
              <br />
              Here's a handy button to get you out of here:
            </p>
          </Fade>

          <Fade delay={delay()}>
            <p>
              <Link to={buttonLink}>
                <Button className={styles.button} type="primary">
                  Get me out of here!
                </Button>
              </Link>
            </p>
          </Fade>
        </div>
      </div>
    </>
  );
};
