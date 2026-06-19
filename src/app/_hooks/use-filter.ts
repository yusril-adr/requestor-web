import { useCallback, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { ColumnFiltersState } from "@tanstack/react-table";

type TFilterFieldConfig = {
  formName: string;
  urlParam: string;
  columnId: string;
  apiField: string;
};

export function useFilter<TFormValues extends Record<string, string | null>>(
  config: TFilterFieldConfig[],
  queryTable: Record<string, string | number | undefined>,
  setSearchParams: (
    updater: (prev: URLSearchParams) => URLSearchParams,
  ) => void,
  reset: (values: Record<string, null>) => void,
) {
  const onFilterSubmit: SubmitHandler<TFormValues> = useCallback(
    (data) => {
      setSearchParams((prev) => {
        config.forEach(({ formName, urlParam }) => {
          prev.set(urlParam, data[formName] ?? "");
        });
        prev.set("page", "1");
        return prev;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config, queryTable, setSearchParams],
    // config is stable (defined inline as literal array), queryTable changes when URL params update
  );

  const columnFilters: ColumnFiltersState = useMemo(
    () =>
      config
        .filter(({ formName }) => queryTable[formName])
        .map(({ formName, columnId }) => ({
          id: columnId,
          value: queryTable[formName],
        })),
    [config, queryTable],
  );

  const filterParams = useMemo(
    () =>
      config.reduce(
        (acc, { formName, apiField }) => ({
          ...acc,
          [apiField]: queryTable[formName] ?? null,
        }),
        {} as Record<string, string | number | null>,
      ),
    [config, queryTable],
  );

  const onFilterReset = useCallback(() => {
    const resetValues = config.reduce(
      (acc, { formName }) => ({ ...acc, [formName]: null }),
      {} as Record<string, null>,
    );
    reset(resetValues);

    setSearchParams((prev) => {
      config.forEach(({ urlParam }) => {
        prev.delete(urlParam);
      });
      prev.set("page", "1");
      return prev;
    });
  }, [config, reset, setSearchParams]);

  return { onFilterSubmit, onFilterReset, columnFilters, filterParams };
}
