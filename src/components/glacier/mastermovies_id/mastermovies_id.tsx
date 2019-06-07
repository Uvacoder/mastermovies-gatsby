import React, { FunctionComponent } from "react";
import styles from "./mastermovies_id.module.css";
import classnames from "classnames";

type spanProps = JSX.IntrinsicElements["span"];
interface IMasterMoviesIDLogoProps extends spanProps {
  bolder?: boolean;
}

  export const MasterMoviesIDLogo: FunctionComponent<IMasterMoviesIDLogoProps> = ({ bolder = false, ...rest }) => (
  <span {...rest}>
    <span className={classnames(styles.mastermovies, {[styles.bolder]: bolder})}>MasterMovies</span>
    &nbsp;
    <span className={classnames(styles.id, {[styles.bolder]: bolder})}>ID</span>
  </span>
)