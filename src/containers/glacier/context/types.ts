import { GlacierSortDefault, IGlacierSort } from "../layout/landing/controls/sort";
import { EGlacierLayout } from "../layout/landing/enum";
import { GlacierSearchBarDefault, IGlacierSearchBar } from "../layout/landing/search/bar";
import { GlacierSearchFilterDefault, IGlacierSearchFilter } from "../layout/landing/search/filter";
import { GlacierSearchRangeDefault, IGlacierSearchRange } from "../layout/landing/search/range";

export interface IGlacierContext {
  filter: IGlacierSearchFilter;
  bar: IGlacierSearchBar;
  range: IGlacierSearchRange;
  layout: EGlacierLayout;
  sort: IGlacierSort;
}

export const GlacierContextDefault: IGlacierContext = {
  filter: GlacierSearchFilterDefault,
  bar: GlacierSearchBarDefault,
  range: GlacierSearchRangeDefault,
  layout: EGlacierLayout.GRID,
  sort: GlacierSortDefault,
};
