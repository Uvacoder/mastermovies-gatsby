import { GlacierSearchFilterDefault } from "../layout/landing/search/filter";
import { EGlacierActions, TGlacierAction } from "./actions";
import { IGlacierContext } from "./types";
import { GlacierSortDefault } from "../layout/landing/controls/sort";

export function glacierContextReducer(oldState: IGlacierContext, action: TGlacierAction): IGlacierContext {
  const state: IGlacierContext = { ...oldState };

  switch (action.type) {
    // Update filters, recalculate active state
    case EGlacierActions.UPDATE_FILTER:
      state.filter = {
        ...state.filter,
        ...action.data,
        filters: {
          ...state.filter.filters,
          ...action.data.filters,
        },
      };
      state.filter.active = Object.entries(state.filter.filters).reduce(
        (previous, [key, value]) => previous || value !== GlacierSearchFilterDefault.filters[key],
        false
      );
      break;

    // Update search bar
    case EGlacierActions.UPDATE_BAR:
      state.bar = {
        ...state.bar,
        ...action.data,
      };
      state.bar.active = state.bar.term !== "";
      break;

    // Update search range
    case EGlacierActions.UPDATE_RANGE:
      state.range = {
        ...state.range,
        ...action.data,
      };
      state.range.active = state.range.range !== null;
      break;

    // Update Glacier layout
    case EGlacierActions.UPDATE_LAYOUT:
      state.layout = action.data;
      break;

    case EGlacierActions.UPDATE_SORT:
      state.sort = { ...state.sort, ...action.data };
      state.sort.active =
        state.sort.by !== GlacierSortDefault.by || state.sort.ascending !== GlacierSortDefault.ascending;
      break;
  }

  return state;
}
