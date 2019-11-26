import React, { FunctionComponent } from "react";

import styles from "./layout.module.css";

export const StatusLayout: FunctionComponent = ({ children }) => <div className={styles.layout} children={children} />;
