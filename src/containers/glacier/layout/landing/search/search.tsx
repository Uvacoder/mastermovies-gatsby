import classnames from "classnames";
import React, { useContext } from "react";
import { GlacierContext } from "../../../context";
import { GlacierSearchBar } from "./bar";
import { GlacierSearchFilter, IGlacierSearchFilter } from "./filter";
import { GlacierSearchRange, TGlacierSearchRange } from "./range";
import styles from "./search.module.css";

export interface IGlacierSearch {
  filter: {
    active: boolean;
    focus: boolean;
    data: IGlacierSearchFilter;
  };
  bar: {
    active: boolean;
    focus: boolean;
    data: string | null;
  };
  range: {
    active: boolean;
    focus: boolean;
    data: TGlacierSearchRange;
  };
}

/** Provides search, filter and date selection UI for sorting Glacier content */
export const GlacierSearch: React.FC = () => {
  const [{ filter, bar, range }] = useContext(GlacierContext);

  // Reduce context to see if there are any active search components
  const active = [filter, bar, range].reduce<any>((p, v) => v.active || v.focus || p, false);

  return (
    <div className={styles.searchWrapper}>
      <div className={classnames(styles.search, { [styles.active]: active })}>
        <GlacierSearchFilter />

        <GlacierSearchBar />

        <GlacierSearchRange />
      </div>
    </div>
  );
};
