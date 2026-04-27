import { apiRequest } from "@/shared/api/client";

import type {
  BouquetCountResponse,
  BouquetType,
  BouquetTypeListResponse,
  CreateSenderBouquetRequest,
  CreateSenderBouquetResponse,
} from "@/features/bouquet/types";

export const fetchBouquetCount = async (baseUrl: string) => {
  const response = await apiRequest<BouquetCountResponse>(
    baseUrl,
    "/api/v1/bouquet/count",
  );
  return response?.data?.count ?? 0;
};

export const fetchBouquetTypes = async (
  baseUrl: string,
): Promise<BouquetType[]> => {
  const response = await apiRequest<BouquetTypeListResponse>(
    baseUrl,
    "/api/v1/bouquet/type",
  );
  return response?.data?.types ?? [];
};

export const createSenderBouquet = async (
  baseUrl: string,
  payload: CreateSenderBouquetRequest,
): Promise<CreateSenderBouquetResponse> => {
  return apiRequest<CreateSenderBouquetResponse>(
    baseUrl,
    "/api/v1/bouquets/sender",
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    },
  );
};
