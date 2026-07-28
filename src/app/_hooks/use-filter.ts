import { useCallback, useMemo } from "react";
import type { SubmitHandler } from "react-hook-form";
import type { ColumnFiltersState } from "@tanstack/react-table";

type TFilterFieldName<TFormValues> = Extract<keyof TFormValues, string>;

type TFilterFieldConfigObject<TFormValues> = {
  formName: TFilterFieldName<TFormValues>;
  columnId?: string;
  apiField?: string;
};

type TFilterFieldConfigInput<TFormValues> =
  | TFilterFieldName<TFormValues>
  | TFilterFieldConfigObject<TFormValues>;

type TNormalizedFilterFieldConfig<TFormValues> = {
  formName: TFilterFieldName<TFormValues>;
  columnId: string;
  apiField: string;
};

/**
 * Connects a filter form to URL query params, TanStack Table column filters,
 * and API payload filter params.
 *
 * A string config must be a key of `TFormValues`. It uses the string as
 * `formName`, then derives `columnId` and `apiField` via camelCase → snake_case
 * conversion.
 *
 * @example
 * useFilter(["status", "priority"], queryStates, setQueryStates, reset);
 *
 * @example
 * useFilter(["action", "targetType"], queryStates, setQueryStates, reset);
 * // "targetType" derives:
 * // columnId: "target_type"
 * // apiField: "target_type"
 *
 * @example
 * useFilter(
 *   [{ formName: "displayName", apiField: "name" }],
 *   queryStates,
 *   setQueryStates,
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
  queryTable: Record<string, string | number | null | undefined>,
  setParams: (updates: {
    page?: number;
    [key: string]: string | number | null | undefined;
  }) => void,
  reset: (values: Record<string, null>) => void,
) {
  const normalizedConfig = useMemo(
    () => config.map(normalizeFilterConfig<TFormValues>),
    [config],
  );

  const onFilterSubmit: SubmitHandler<TFormValues> = useCallback(
    (data) => {
      const updates: {
        page?: number;
        [key: string]: string | number | null | undefined;
      } = { page: 1 };
      normalizedConfig.forEach(({ formName }) => {
        updates[formName] = data[formName] ?? null;
      });
      setParams(updates);
    },
    [normalizedConfig, setParams],
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

    const updates: {
      page?: number;
      [key: string]: string | number | null | undefined;
    } = { page: 1 };
    normalizedConfig.forEach(({ formName }) => {
      updates[formName] = null;
    });
    setParams(updates);
  }, [normalizedConfig, reset, setParams]);

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
      columnId: defaultKey,
      apiField: defaultKey,
    };
  }

  return {
    formName,
    columnId: config.columnId ?? defaultKey,
    apiField: config.apiField ?? defaultKey,
  };
}
