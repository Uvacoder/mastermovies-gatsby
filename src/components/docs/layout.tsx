import "./swagger-ui.css"; // Needs to be applied globally

import { Button } from "antd";
import React, { FunctionComponent } from "react";

import styles from "./layout.module.css";
import { Link } from "gatsby";

export const DocsLayout: FunctionComponent = (props) => {

  return (
    <div className={styles.root}>
      <nav className={styles.nav}>
        <Link to="/"><Button icon="home" size="large">Back to MasterMovies</Button></Link>
      </nav>
      <div className={styles.container}>
        {props.children}
      </div>
    </div>
  )
};
