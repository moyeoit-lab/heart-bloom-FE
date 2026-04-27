export const bouquetKeys = {
  all: ["bouquet"] as const,
  count: (apiUrl: string | undefined) =>
    [...bouquetKeys.all, "count", apiUrl] as const,
  types: (apiUrl: string | undefined) =>
    [...bouquetKeys.all, "types", apiUrl] as const,
};
