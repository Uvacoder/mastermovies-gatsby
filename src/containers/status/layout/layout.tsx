import React from "react";

import styles from "./layout.module.css";

export const StatusLayout: React.FC = ({ children }) => <div className={styles.layout} children={children} />;
