import classnames from "classnames";
import React, { FunctionComponent, useContext } from "react";

import { Button, Dropdown, Icon, Menu, Radio } from "antd";
import RadioGroup from "antd/lib/radio/group";
import { DarkButton } from "../../../../../../components/glacier/dark_button";
import { EGlacierActions, GlacierContext } from "../../../../context";
import styles from "./sort.module.css";

/** Standard enum also used for API queries */
export enum EGlacierSort {
  RELEASE = "release",
  VIEWS = "views",
  NAME = "name",
}

export interface IGlacierSort {
  ascending: boolean;
  by: EGlacierSort;
  active: boolean;
}

export const GlacierSortDefault = {
  ascending: false,
  by: EGlacierSort.RELEASE,
  active: false,
};

export const GlacierSortSelector: FunctionComponent = () => {
  const [{ sort }, dispatch] = useContext(GlacierContext);

  const overlay = (
    <Menu className={styles.overlay}>
      <h3 className={styles.title}>Sort by</h3>
      <RadioGroup
        value={sort.by}
        className={styles.sortBy}
        onChange={value => dispatch({ type: EGlacierActions.UPDATE_SORT, data: { by: value.target.value } })}
      >
        <Radio value={EGlacierSort.RELEASE} className={styles.radio}>
          Release Date
        </Radio>
        <Radio value={EGlacierSort.NAME} className={styles.radio}>
          Name
        </Radio>
        <Radio value={EGlacierSort.VIEWS} className={styles.radio}>
          Views
        </Radio>
      </RadioGroup>
      <RadioGroup
        value={sort.ascending}
        className={styles.sortAscending}
        onChange={value => dispatch({ type: EGlacierActions.UPDATE_SORT, data: { ascending: value.target.value } })}
      >
        <Radio.Button value={true}>Ascending</Radio.Button>
        <Radio.Button value={false}>Descending</Radio.Button>
      </RadioGroup>
      <div className={styles.reset}>
        <Button type="link" onClick={() => dispatch({ type: EGlacierActions.UPDATE_SORT, data: GlacierSortDefault })}>
          Reset to default
        </Button>
      </div>
    </Menu>
  );

  return (
    <Dropdown trigger={["click"]} overlay={overlay}>
      <DarkButton large className={classnames(styles.button, { [styles.active]: sort.active })}>
        <Icon type="filter" style={{ marginRight: "0.2em" }} /> Sort
      </DarkButton>
    </Dropdown>
  );
};
