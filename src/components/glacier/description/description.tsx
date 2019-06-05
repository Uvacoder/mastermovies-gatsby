import React, { ReactNode, FunctionComponent } from "react";
import { Col } from "antd";
import styles from "./description.module.css";

interface IDescriptionProps {
  name: string;
  children: ReactNode;
  span?: number;
}

export const Description: FunctionComponent<IDescriptionProps> = ({ name, children, span = 12 }) => (
  <Col md={span} sm={24}>
    <div className={styles.description}>
      <div className={styles.name}>{name}</div>
      <div className={styles.value}>{children}</div>
    </div>
  </Col>
);