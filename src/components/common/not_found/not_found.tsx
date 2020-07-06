import { SmileOutlined, WarningOutlined } from "@ant-design/icons";
import { Button } from "antd";
import classnames from "classnames";
import { Link } from "gatsby";
import React, { ReactNode, useContext } from "react";
import { Fade } from "react-reveal";
import { ThemeContext } from "../../../hooks/theme";
import { MasterMoviesLogo } from "../logos";
import { SEO } from "../seo";
import styles from "./not_found.module.css";

interface INotFoundProps {
  buttonLink?: string;
  logo?: ReactNode;
}

export const NotFound: React.FC<INotFoundProps> = ({ buttonLink = "/", logo = <MasterMoviesLogo width="64px" /> }) => {
  const theme = useContext(ThemeContext);

  let lastDelay = 50;
  const delay = () => (lastDelay += 75);

  const FadeWrapper: React.FC = ({ children }) => (
    <Fade delay={delay()} ssrReveal>
      {children}
    </Fade>
  );

  return (
    <>
      <SEO title="Whoops... Where's that?" keywords={["MasterMovies"]} />
      <div className={classnames(styles.notFound, { [styles.dark]: theme === "dark" })}>
        <div className={styles.container}>
          <FadeWrapper>
            <span className={styles.logo}>{logo}</span>
          </FadeWrapper>

          <FadeWrapper>
            <h1>
              <WarningOutlined /> Warning <WarningOutlined />
            </h1>
          </FadeWrapper>

          <FadeWrapper>
            <h3>You tried to access something that doesn't exist!</h3>
          </FadeWrapper>

          <FadeWrapper>
            <p>
              <b>Don't panic!</b> We intercepted the request and destroyed it before it could create a hole in the
              space-time continuum. You're welcome <SmileOutlined />
            </p>
          </FadeWrapper>

          <FadeWrapper>
            <p>
              That does mean we don't have anything to show you.
              <br />
              Here's a handy button to get you out of here:
            </p>
          </FadeWrapper>

          <FadeWrapper>
            <p>
              <Link to={buttonLink}>
                <Button className={styles.button} type="primary">
                  Get me out of here!
                </Button>
              </Link>
            </p>
          </FadeWrapper>
        </div>
      </div>
    </>
  );
};
