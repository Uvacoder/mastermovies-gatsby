import { IGlacierSort } from "../layout/landing/controls/sort";
import { EGlacierLayout } from "../layout/landing/enum";
import { IGlacierSearchBar } from "../layout/landing/search/bar";
import { IGlacierSearchFilter } from "../layout/landing/search/filter";
import { IGlacierSearchRange } from "../layout/landing/search/range";

type TAction<K, V = void> = V extends void ? { type: K } : { type: K } & V;

export enum EGlacierActions {
  UPDATE_FILTER,
  UPDATE_BAR,
  UPDATE_RANGE,
  UPDATE_LAYOUT,
  UPDATE_SORT,
}

export type TGlacierAction =
  | TAction<EGlacierActions.UPDATE_FILTER, { data: Partial<IGlacierSearchFilter> }>
  | TAction<EGlacierActions.UPDATE_BAR, { data: Partial<IGlacierSearchBar> }>
  | TAction<EGlacierActions.UPDATE_RANGE, { data: Partial<IGlacierSearchRange> }>
  | TAction<EGlacierActions.UPDATE_LAYOUT, { data: Partial<EGlacierLayout> }>
  | TAction<EGlacierActions.UPDATE_SORT, { data: Partial<IGlacierSort> }>;
