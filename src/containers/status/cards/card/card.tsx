import { Divider } from "antd";
import classnames from "classnames";
import React, { FunctionComponent } from "react";

import styles from "./card.module.css";

/** Creates a card element */
export const StatusCard: FunctionComponent<JSX.IntrinsicElements["div"]> = ({ className, ...rest }) => (
  <div className={classnames(styles.card, className)} {...rest} />
);

/** A properly padded card row */
export const StatusCardRow: FunctionComponent<JSX.IntrinsicElements["div"] & { align?: boolean }> = ({
  align,

  className,
  ...rest
}) => <div className={classnames(styles.row, { [styles.align]: align }, className)} {...rest} />;

/** Adds a prefix to a row */
export const StatusCardIcon: FunctionComponent<JSX.IntrinsicElements["div"]> = ({ className, ...rest }) => (
  <div className={classnames(styles.status, className)} {...rest} />
);

/** A divider without margins */
export const StatusCardDivider: FunctionComponent = () => <Divider className={styles.divider} />;

/** Creates bold text for a row item */
export const StatusCardText: FunctionComponent<JSX.IntrinsicElements["div"]> = ({ className, ...rest }) => (
  <div className={styles.primaryText} {...rest} />
);

/** Creates a faded sub-text for a row item */
export const StatusCardSubText: FunctionComponent<JSX.IntrinsicElements["div"]> = ({ className, ...rest }) => (
  <div className={styles.secondaryText} {...rest} />
);
