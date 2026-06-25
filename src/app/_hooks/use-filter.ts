import { useCallback, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { ColumnFiltersState } from "@tanstack/react-table";

type TFilterFieldName<TFormValues> = Extract<keyof TFormValues, string>;

type TFilterFieldConfigObject<TFormValues> = {
  formName: TFilterFieldName<TFormValues>;
  urlParam?: string;
  columnId?: string;
  apiField?: string;
};

type TFilterFieldConfigInput<TFormValues> =
  | TFilterFieldName<TFormValues>
  | TFilterFieldConfigObject<TFormValues>;

type TNormalizedFilterFieldConfig<TFormValues> = {
  formName: TFilterFieldName<TFormValues>;
  urlParam: string;
  columnId: string;
  apiField: string;
};

/**
 * Connects a filter form to URL params, TanStack Table column filters, and API
 * payload filter params.
 *
 * A string config must be a key of `TFormValues`. It uses the string as
 * `formName`, then derives `urlParam`, `columnId`, and `apiField` from it
 * using snake_case.
 *
 * @example
 * useFilter(["status", "priority"], queryUrl, setSearchParams, reset);
 *
 * @example
 * useFilter(["action", "targetType"], queryUrl, setSearchParams, reset);
 * // "targetType" derives:
 * // urlParam: "target_type"
 * // columnId: "target_type"
 * // apiField: "target_type"
 *
 * @example
 * useFilter(
 *   [{ formName: "displayName", apiField: "name" }],
 *   queryUrl,
 *   setSearchParams,
 *   reset,
 * );
 *
 * @example
 * // TypeScript rejects field names that do not exist in TFormValues:
 * // useFilter<TUserTableFilterValues>(["unknownField"], ...);
 *
 * @returns handlers for filter submit/reset, table column filters, and API
 * filter params.
 */
export function useFilter<TFormValues extends Record<string, string | null>>(
  config: TFilterFieldConfigInput<TFormValues>[],
  queryTable: Record<string, string | number | undefined>,
  setSearchParams: (
    updater: (prev: URLSearchParams) => URLSearchParams,
  ) => void,
  reset: (values: Record<string, null>) => void,
) {
  const normalizedConfig = useMemo(
    () => config.map(normalizeFilterConfig<TFormValues>),
    [config],
  );

  const onFilterSubmit: SubmitHandler<TFormValues> = useCallback(
    (data) => {
      setSearchParams((prev) => {
        normalizedConfig.forEach(({ formName, urlParam }) => {
          prev.set(urlParam, data[formName] ?? "");
        });
        prev.set("page", "1");
        return prev;
      });
    },
    [normalizedConfig, setSearchParams],
  );

  const columnFilters: ColumnFiltersState = useMemo(
    () =>
      normalizedConfig
        .filter(({ formName }) => queryTable[formName])
        .map(({ formName, columnId }) => ({
          id: columnId,
          value: queryTable[formName],
        })),
    [normalizedConfig, queryTable],
  );

  const filterParams = useMemo(
    () =>
      normalizedConfig.reduce(
        (acc, { formName, apiField }) => ({
          ...acc,
          [apiField]: queryTable[formName] ?? null,
        }),
        {} as Record<string, string | number | null>,
      ),
    [normalizedConfig, queryTable],
  );

  const onFilterReset = useCallback(() => {
    const resetValues = normalizedConfig.reduce(
      (acc, { formName }) => ({ ...acc, [formName]: null }),
      {} as Record<string, null>,
    );
    reset(resetValues);

    setSearchParams((prev) => {
      normalizedConfig.forEach(({ urlParam }) => {
        prev.delete(urlParam);
      });
      prev.set("page", "1");
      return prev;
    });
  }, [normalizedConfig, reset, setSearchParams]);

  return { onFilterSubmit, onFilterReset, columnFilters, filterParams };
}

function toFilterKey(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

function normalizeFilterConfig<TFormValues>(
  config: TFilterFieldConfigInput<TFormValues>,
): TNormalizedFilterFieldConfig<TFormValues> {
  const formName = typeof config === "string" ? config : config.formName;
  const defaultKey = toFilterKey(formName);

  if (typeof config === "string") {
    return {
      formName,
      urlParam: defaultKey,
      columnId: defaultKey,
      apiField: defaultKey,
    };
  }

  return {
    formName,
    urlParam: config.urlParam ?? defaultKey,
    columnId: config.columnId ?? defaultKey,
    apiField: config.apiField ?? defaultKey,
  };
}
