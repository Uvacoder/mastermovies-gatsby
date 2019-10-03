import { Icon } from "antd";
import classnames from "classnames";
import React, { FunctionComponent, useCallback, useContext, useEffect, useRef } from "react";

import { Keyboard } from "../../../../../../components/common/keyboard";
import { GlacierContext } from "../../../../context";
import { EGlacierActions } from "../../../../context/actions";
import styles from "./bar.module.css";

export interface IGlacierSearchBar {
  active: boolean;
  focus: boolean;
  term: string;
}

export const GlacierSearchBarDefault = {
  active: false,
  focus: false,
  term: "",
};

export const GlacierSearchBar: FunctionComponent = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [{ bar }, dispatch] = useContext(GlacierContext);
  const updateBar = (newBar: Partial<IGlacierSearchBar>) => {
    dispatch({ type: EGlacierActions.UPDATE_BAR, data: newBar });
  };

  // Apply focus/blur once mounted, and save the ref for later use
  const setRef = useCallback<(node: HTMLInputElement) => void>(node => {
    if (node) {
      if (bar.focus) {
        inputRef.current.value = bar.term; // sync with state when appearing
        node.focus();
      } else {
        node.blur();
      }
    }
    inputRef.current = node;
  }, []);

  // Handle context based focusing/blurring, delay the clear to prevent flicker
  useEffect(() => {
    if (inputRef.current) {
      if (bar.focus) {
        inputRef.current.value = bar.term; // sync with state when appearing
        inputRef.current.focus();
      } else {
        inputRef.current.blur();
      }
    }
  }, [bar.focus]);

  // Key based focus/blur
  useEffect(() => {
    const keyHandler = (event: KeyboardEvent) => {
      if (event.key === "/") {
        updateBar({ focus: true });
        event.preventDefault();
      } else if (event.key === "Escape") {
        updateBar({ focus: false });
      }
    };

    document.addEventListener("keydown", keyHandler);
    return () => {
      document.removeEventListener("keydown", keyHandler);
    };
  }, []);

  return (
    <div className={styles.bar}>
      <span className={styles.barHint}>Search...</span>
      <Icon type="search" className={classnames(styles.barIcon, { [styles.active]: bar.active })} />
      <div className={classnames(styles.inputWrapper, { [styles.focus]: bar.focus, [styles.active]: bar.active })}>
        <input
          ref={setRef}
          onFocus={() => {
            updateBar({ focus: true });
          }}
          onBlur={() => {
            updateBar({ focus: false });
          }}
          className={styles.input}
          placeholder="What are you looking for?"
          onChange={event => {
            const searchTerm = event.target ? event.target.value : null;
            updateBar({ active: !!searchTerm, term: searchTerm });
          }}
        />
        <div className={classnames(styles.suffix, styles.clearButton)} onClick={() => updateBar({ term: "" })}>
          <span>
            <Icon type="close-circle" theme="filled" />
            &nbsp;&nbsp;Clear
          </span>
        </div>
      </div>
      <div className={classnames(styles.suffix, styles.keyboardHint)}>
        <span>
          Press <Keyboard>/</Keyboard>
        </span>
      </div>
    </div>
  );
};
