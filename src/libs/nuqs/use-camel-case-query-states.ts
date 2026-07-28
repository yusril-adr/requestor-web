import { useQueryStates } from "nuqs";
import type { UseQueryStatesKeysMap, UseQueryStatesOptions, UrlKeys } from "nuqs";

function toSnakeCase(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
}

export function useCamelCaseQueryStates<KeyMap extends UseQueryStatesKeysMap>(
  keyMap: KeyMap,
  options?: Omit<Partial<UseQueryStatesOptions<KeyMap>>, "urlKeys">,
) {
  const urlKeys = Object.keys(keyMap).reduce(
    (acc, key) => {
      (acc as Record<string, string>)[key] = toSnakeCase(key);
      return acc;
    },
    {} as UrlKeys<KeyMap>,
  );

  return useQueryStates(keyMap, { ...options, urlKeys });
}
