import classnames from "classnames";
import React from "react";
import Fade from "react-reveal";
import styles from "./section.module.css";

type sectionProps = JSX.IntrinsicElements["section"];
type divProps = JSX.IntrinsicElements["div"];

interface IPortfolioSectionProps {
  /** Add padding to the bottom of the section */
  separate?: boolean;
  /** Add 10% left and right padding */
  padding?: boolean;
  /** Disable fade effects */
  noFade?: boolean;
}

export const PortfolioSection: React.FC<IPortfolioSectionProps & sectionProps> = ({
  children,
  className,
  separate,
  padding,
  noFade,
  ...rest
}) => (
  <section
    {...rest}
    className={classnames(styles.section, { [styles.separate]: separate, [styles.sectionPadding]: padding }, className)}
  >
    {children}
  </section>
);

interface IPortfolioContentProps {
  /** Use flex to center horizontally */
  horizontal?: boolean;
  /** Use flex to center vertically */
  vertical?: boolean;
  /** Apply padding to the content */
  padding?: boolean;
}

export const PortfolioContent: React.FC<IPortfolioContentProps & divProps> = ({
  className,
  horizontal,
  vertical,
  padding,
  ...rest
}) => (
  <div className={styles.column}>
    <Fade>
      <div
        {...rest}
        className={classnames(
          styles.content,
          {
            [styles.horizontal]: horizontal,
            [styles.vertical]: vertical,
            [styles.padding]: padding,
          },
          className
        )}
      />
    </Fade>
  </div>
);

export const PortfolioTitle: React.FC<JSX.IntrinsicElements["h1"]> = ({ className, ...rest }) => (
  <h1 {...rest} className={classnames(styles.title, className)} />
);
