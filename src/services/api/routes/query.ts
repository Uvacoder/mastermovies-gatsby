/**
 * Takes an object of key/value pairs, and constructs a query
 * string to append to a URL. Supports boolean values (without `=`)
 * as well as any other type that can be converted to a string.
 */
export function addQueryParams(params?: object): string {
  if (!params) return "";

  const entries = Object.entries(params);
  if (entries.length === 0) return "";

  const queryParts = [];

  for (const [key, value] of entries) {
    if (typeof value === "boolean") {
      if (value === true) {
        queryParts.push(key);
      }
    } else {
      queryParts.push(`${key}=${String(value)}`);
    }
  }

  return "?" + queryParts.join("&");
}
