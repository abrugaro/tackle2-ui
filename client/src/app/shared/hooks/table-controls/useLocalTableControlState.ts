import { useCompoundExpansionState } from "../useCompoundExpansionState";
import { useSelectionState } from "@migtools/lib-ui";
import {
  getLocalPaginationDerivedState,
  usePaginationState,
} from "./pagination";
import { useSortState, getLocalSortDerivedState } from "./sorting";
import {
  IUseLocalTableControlStateArgs,
  IUseTableControlPropsArgs,
} from "./types";
import { getLocalFilterDerivedState, useFilterState } from "./filtering";

export const useLocalTableControlState = <
  TItem,
  TColumnKey extends string,
  TSortableColumnKey extends TColumnKey
>(
  args: IUseLocalTableControlStateArgs<TItem, TColumnKey, TSortableColumnKey>
): IUseTableControlPropsArgs<TItem, TColumnKey, TSortableColumnKey> => {
  const {
    items,
    filterCategories = [],
    sortableColumns = [],
    getSortValues,
    initialSort = null,
    hasPagination = true,
    initialItemsPerPage = 10,
    idProperty,
  } = args;

  const filterState = useFilterState(args);
  const { filteredItems } = getLocalFilterDerivedState({
    items,
    filterCategories,
    filterState,
  });

  const expansionState = useCompoundExpansionState<TItem, TColumnKey>(
    idProperty
  );

  const selectionState = useSelectionState({
    items: filteredItems,
    isEqual: (a, b) => a[idProperty] === b[idProperty],
  });

  const sortState = useSortState({ sortableColumns, initialSort });
  const { sortedItems } = getLocalSortDerivedState({
    sortState,
    items: filteredItems,
    getSortValues,
  });

  const paginationState = usePaginationState({
    initialItemsPerPage,
  });
  const { currentPageItems } = getLocalPaginationDerivedState({
    paginationState,
    items: sortedItems,
  });

  return {
    ...args,
    filterState,
    expansionState,
    selectionState,
    sortState,
    paginationState,
    totalItemCount: items.length,
    currentPageItems: hasPagination ? currentPageItems : sortedItems,
  };
};