import { Icon, Radio } from "antd";
import classnames from "classnames";
import React, { FunctionComponent, useContext } from "react";

import { EGlacierActions, GlacierContext } from "../../../../context";
import { EGlacierLayout } from "../../enum";
import styles from "./layout_selector.module.css";

export const GlacierLayoutSelector: FunctionComponent = () => {
  const [{ layout }, dispatch] = useContext(GlacierContext);

  return (
    <Radio.Group
      value={layout}
      onChange={e => {
        dispatch({ type: EGlacierActions.UPDATE_LAYOUT, data: e.target.value });
      }}
      size={"large"}
      className={styles.layoutSelector}
    >
      <Radio.Button
        value={EGlacierLayout.GRID}
        className={classnames(styles.button, { [styles.active]: layout === EGlacierLayout.GRID })}
      >
        <Icon type="layout" /> Grid
      </Radio.Button>

      <Radio.Button
        value={EGlacierLayout.LIST}
        className={classnames(styles.button, { [styles.active]: layout === EGlacierLayout.LIST })}
      >
        <Icon type="unordered-list" /> List
      </Radio.Button>
    </Radio.Group>
  );
};
