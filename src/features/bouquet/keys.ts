export const bouquetKeys = {
  all: ["bouquet"] as const,
  count: (apiUrl: string | undefined) => [...bouquetKeys.all, "count", apiUrl] as const,
};
