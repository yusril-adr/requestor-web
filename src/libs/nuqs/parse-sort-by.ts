import { createParser } from "nuqs";

/**
 * Creates a nuqs parser for sort_by that validates against
 * declared valid keys at the call site.
 *
 * Invalid values in the URL are logged to console and treated as null.
 *
 * @param validKeys - const array of valid sort keys (e.g. ["id","name","email"])
 * @param label - optional label for console error (defaults to "SortBy")
 */
export function createSortByParser<const T extends readonly string[]>(
  validKeys: T,
  label = "SortBy",
) {
  return createParser({
    parse(queryValue): T[number] | null {
      if (queryValue === "") return null;
      if ((validKeys as readonly string[]).includes(queryValue)) {
        return queryValue as T[number];
      }
      console.error(
        `[${label}] Invalid sort_by value from URL: "${queryValue}". ` +
          `Expected one of: ${validKeys.join(", ")}`,
      );
      return null;
    },
    serialize(value) {
      return value ?? "";
    },
  });
}
