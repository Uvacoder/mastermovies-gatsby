import React from "react";
import styles from "./keyboard.module.css";

export const Keyboard: React.FC = ({ children }) => <kbd className={styles.keyboard}>{children}</kbd>;
