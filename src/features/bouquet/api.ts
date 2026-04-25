import { apiRequest } from "@/shared/api/client";

import type { BouquetCountResponse } from "@/features/bouquet/types";

export const fetchBouquetCount = async (baseUrl: string) => {
  const response = await apiRequest<BouquetCountResponse>(baseUrl, "/api/v1/bouquet/count");
  return response?.data?.count ?? 0;
};
