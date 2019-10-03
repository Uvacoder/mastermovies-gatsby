import React, { FunctionComponent } from "react";

import styles from "./keyboard.module.css";

export const Keyboard: FunctionComponent = ({ children }) => <kbd className={styles.keyboard}>{children}</kbd>;
