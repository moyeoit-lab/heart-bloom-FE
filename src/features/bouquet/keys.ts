export const bouquetKeys = {
  all: ["bouquet"] as const,
  list: (apiUrl: string | undefined) =>
    [...bouquetKeys.all, "list", apiUrl] as const,
  count: (apiUrl: string | undefined) =>
    [...bouquetKeys.all, "count", apiUrl] as const,
  types: (apiUrl: string | undefined) =>
    [...bouquetKeys.all, "types", apiUrl] as const,
};
