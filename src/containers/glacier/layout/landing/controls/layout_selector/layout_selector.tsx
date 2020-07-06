import { LayoutOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Radio } from "antd";
import classnames from "classnames";
import React, { useContext } from "react";
import { EGlacierActions, GlacierContext } from "../../../../context";
import { EGlacierLayout } from "../../enum";
import styles from "./layout_selector.module.css";

export const GlacierLayoutSelector: React.FC = () => {
  const [{ layout }, dispatch] = useContext(GlacierContext);

  return (
    <Radio.Group
      value={layout}
      onChange={(e) => {
        dispatch({ type: EGlacierActions.UPDATE_LAYOUT, data: e.target.value });
      }}
      size={"large"}
      className={styles.layoutSelector}
    >
      <Radio.Button
        value={EGlacierLayout.GRID}
        className={classnames(styles.button, { [styles.active]: layout === EGlacierLayout.GRID })}
      >
        <LayoutOutlined /> Grid
      </Radio.Button>

      <Radio.Button
        value={EGlacierLayout.LIST}
        className={classnames(styles.button, { [styles.active]: layout === EGlacierLayout.LIST })}
      >
        <UnorderedListOutlined /> List
      </Radio.Button>
    </Radio.Group>
  );
};
