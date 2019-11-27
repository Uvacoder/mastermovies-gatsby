import classnames from "classnames";
import React, { FunctionComponent, useContext } from "react";

import { Typography } from "antd";
import { GlacierNotSpecified } from "../../../containers/glacier/layout/film_info/not_specified";
import { ThemeContext } from "../../../hooks/theme";
import { IStyleProps } from "../../../types/component";
import { Skeleton } from "../../common/skeleton";
import styles from "./film_meta.module.css";

interface IFilmMetaProps {
  name: string | undefined;
  release: string | number | undefined;
  description: string | undefined;
}

/**
 * A self-contained formatted video title + description generator. Supports skeleton loading.
 *
 * The font size is based on `em`.
 */
export const GlacierFilmMeta: FunctionComponent<IFilmMetaProps & IStyleProps> = ({
  name,
  release,
  description,
  className,
  ...rest
}) => {
  const theme = useContext(ThemeContext);

  return (
    <div {...rest} className={classnames(styles.meta, { [styles.dark]: theme === "dark" }, className)}>
      <GlacierFilmTitle name={name} release={release} />
      <GlacierFilmDescription description={description} />
    </div>
  );
};

/** A formatted Glacier film title with skeleton loading */
export const GlacierFilmTitle: FunctionComponent<{
  name: string | undefined;
  release: string | number | undefined;
} & IStyleProps> = ({ name, release, className, ...rest }) => {
  const theme = useContext(ThemeContext);

  const titleElement = name ? name.toUpperCase() : <Skeleton style={{ width: "8em", maxWidth: "60%" }} />;

  const releaseElement = release ? (
    typeof release === "number" ? (
      release.toString()
    ) : (
      new Date(release).getFullYear()
    )
  ) : (
    <Skeleton lighter style={{ width: "3em", maxWidth: "40%" }} />
  );

  return (
    <div {...rest} className={classnames(styles.title, { [styles.dark]: theme === "dark" }, className)}>
      {titleElement} <span className={styles.release}>{releaseElement}</span>
    </div>
  );
};

/**
 * A formatted film description with skeleton loading.
 * Due to https://github.com/ant-design/ant-design/issues/19088, Paragraph throws console errors
 */
export const GlacierFilmDescription: FunctionComponent<{ description: string | undefined } & IStyleProps> = ({
  description,
  className,
  ...rest
}) => {
  const theme = useContext(ThemeContext);

  const descriptionElement =
    typeof description !== "undefined" ? (
      description ? (
        description
      ) : (
        <GlacierNotSpecified>This film has no description</GlacierNotSpecified>
      )
    ) : (
      <Skeleton count={3} light shorter />
    );

  return typeof descriptionElement === "string" ? (
    <Typography.Paragraph
      {...rest}
      className={classnames(styles.description, { [styles.dark]: theme === "dark" }, className)}
      ellipsis={{ rows: 3 }}
    >
      {descriptionElement}
    </Typography.Paragraph>
  ) : (
    <div className={styles.description}>{descriptionElement}</div>
  );
};
