import { Icon } from "antd";
import classnames from "classnames";
import React, { FunctionComponent, useRef, useState } from "react";

import styles from "./search.module.css";

type inputProps = JSX.IntrinsicElements["input"];
interface IGlacierSearchProps extends inputProps {
  onSearch?: (value: string) => any;
  showClear?: boolean;
}

export const GlacierSearch: FunctionComponent<IGlacierSearchProps> = ({ className, onSearch = () => {}, showClear }) => {

  const [ focus, setFocus ] = useState(false);
  const [ hover, setHover ] = useState(false);

  const input = useRef(null);

  return (
    <span
      className={classnames(styles.bar, className, {[styles.focus]: focus || hover})}
      onMouseOver={() => setHover(true)}
      onMouseOut={() => setHover(false)}
    >
      <Icon type="search" className={styles.icon} />
      <input
        ref={input}
        className={styles.input}
        placeholder="Search for films"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onChange={e => onSearch(e.target.value)}
      />
      {showClear && <Icon type="close" className={styles.clear} onClick={() => { input.current.value = ""; onSearch(""); }} />}
    </span>
  );

}
