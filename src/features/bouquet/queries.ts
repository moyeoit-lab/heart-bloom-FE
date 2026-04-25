import { useQuery } from "@tanstack/react-query";

import { fetchBouquetCount } from "@/features/bouquet/api";
import { bouquetKeys } from "@/features/bouquet/keys";

export const useBouquetCountQuery = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.count(apiUrl),
    queryFn: () => fetchBouquetCount(apiUrl as string),
    enabled: Boolean(apiUrl),
  });
};
