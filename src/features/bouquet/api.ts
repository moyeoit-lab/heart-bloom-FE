import { apiRequest } from "@/shared/api/client";

import type {
  ApiVoidResponse,
  BouquetCountResponse,
  BouquetForReceiver,
  BouquetForReceiverResponse,
  BouquetLinkUrlResponse,
  BouquetQuestionAnswers,
  BouquetQuestionAnswersResponse,
  BouquetType,
  BouquetTypeListResponse,
  CompleteBouquetRequest,
  CreateBouquetRequest,
  CreateBouquetResponse,
  LandingQuestion,
  LandingQuestionsResponse,
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
  return response?.data ?? [];
};

export const fetchLandingQuestions = async (
  baseUrl: string,
): Promise<LandingQuestion[]> => {
  const response = await apiRequest<LandingQuestionsResponse>(
    baseUrl,
    "/api/v1/questions/landing",
  );
  return response?.data?.questions ?? [];
};

export const createBouquet = async (
  baseUrl: string,
  payload: CreateBouquetRequest,
): Promise<CreateBouquetResponse> => {
  return apiRequest<CreateBouquetResponse>(baseUrl, "/api/v1/bouquet", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchBouquetLinkUrl = async (
  baseUrl: string,
  bouquetId: number,
): Promise<string | undefined> => {
  const response = await apiRequest<BouquetLinkUrlResponse>(
    baseUrl,
    `/api/v1/bouquet/link/${bouquetId}/url`,
  );
  return response?.data?.url;
};

// ── 수신자 측 (bouquet-receiver-controller) ────────────────────────────────
export const fetchBouquetByLink = async (
  baseUrl: string,
  token: string,
): Promise<BouquetForReceiver | undefined> => {
  const response = await apiRequest<BouquetForReceiverResponse>(
    baseUrl,
    `/api/v1/bouquets/links/${encodeURIComponent(token)}`,
  );
  return response?.data;
};

export const fetchBouquetQuestionAnswers = async (
  baseUrl: string,
  token: string,
  questionId: number,
): Promise<BouquetQuestionAnswers | undefined> => {
  const response = await apiRequest<BouquetQuestionAnswersResponse>(
    baseUrl,
    `/api/v1/bouquets/links/${encodeURIComponent(token)}/questions/${questionId}/answers`,
  );
  return response?.data;
};

export const claimBouquetLink = async (
  baseUrl: string,
  token: string,
): Promise<ApiVoidResponse> => {
  return apiRequest<ApiVoidResponse>(
    baseUrl,
    `/api/v1/bouquets/links/${encodeURIComponent(token)}/claim`,
    { method: "POST" },
  );
};

export const completeBouquet = async (
  baseUrl: string,
  token: string,
  payload: CompleteBouquetRequest,
): Promise<ApiVoidResponse> => {
  return apiRequest<ApiVoidResponse>(
    baseUrl,
    `/api/v1/bouquets/links/${encodeURIComponent(token)}/answers`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const fetchBouquetShelf = async (
  baseUrl: string,
): Promise<{
  senderName: string;
  sentBouquets: BouquetShelfItem[];
  receivedBouquets: BouquetShelfItem[];
}> => {
  const response = await apiRequest<BouquetShelfResponse>(baseUrl, "/api/v1/bouquet");
  return {
    senderName: response?.data?.senderName ?? "",
    sentBouquets: response?.data?.sentBouquets ?? [],
    receivedBouquets: response?.data?.receivedBouquets ?? [],
  };
};
