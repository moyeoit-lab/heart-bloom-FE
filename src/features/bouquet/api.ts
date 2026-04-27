import { apiRequest } from "@/shared/api/client";

import type {
  BouquetCountResponse,
  BouquetType,
  BouquetTypeListResponse,
} from "@/features/bouquet/types";

export const fetchBouquetCount = async (baseUrl: string) => {
  const response = await apiRequest<BouquetCountResponse>(baseUrl, "/api/v1/bouquet/count");
  return response?.data?.count ?? 0;
};

export const fetchBouquetTypes = async (baseUrl: string): Promise<BouquetType[]> => {
  const response = await apiRequest<BouquetTypeListResponse>(baseUrl, "/api/v1/bouquet/type");
  return response?.data?.types ?? [];
};
