import { Button, Dropdown, Icon, Menu, Switch } from "antd";
import classnames from "classnames";
import React, { FunctionComponent, useContext } from "react";

import { GlacierContext } from "../../../../context";
import { EGlacierActions } from "../../../../context/actions";
import styles from "./filter.module.css";

export interface IGlacierSearchFilter {
  active: boolean;
  focus: boolean;
  filters: {
    onlyPublic: boolean;
  };
}

export const GlacierSearchFilterDefault: IGlacierSearchFilter = {
  active: false,
  focus: false,
  filters: {
    onlyPublic: false,
  },
};

/** Provides a UI to easily filter results, turns blue when active */
export const GlacierSearchFilter: FunctionComponent = () => {
  const [{ filter }, dispatch] = useContext(GlacierContext);

  const updateFilter = (newFilter: Partial<IGlacierSearchFilter>) => {
    dispatch({ type: EGlacierActions.UPDATE_FILTER, data: newFilter });
  };

  return (
    <Dropdown
      onVisibleChange={visible => updateFilter({ focus: visible })}
      overlay={
        <Menu className={styles.menu}>
          <div className={styles.panel}>
            <span>Public only</span>
            <Switch
              checked={filter.filters.onlyPublic}
              onChange={state => updateFilter({ filters: { onlyPublic: state } })}
            />
          </div>
          <div className={styles.reset}>
            <Button type="link" onClick={() => updateFilter({ filters: { ...GlacierSearchFilterDefault.filters } })}>
              Reset filters
            </Button>
          </div>
        </Menu>
      }
      trigger={["click"]}
    >
      <div className={classnames(styles.filter, { [styles.active]: filter.active })}>
        <Icon type="filter" theme="filled" />
        &nbsp;&nbsp;Filters
        <Icon type="down" />
      </div>
    </Dropdown>
  );
};
