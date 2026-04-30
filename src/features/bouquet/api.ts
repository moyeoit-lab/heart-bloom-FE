import { apiRequest } from "@/shared/api/client";

import type {
  BouquetAlertItem,
  BouquetAlertsResponse,
  ApiVoidResponse,
  BouquetCountResponse,
  BouquetForReceiver,
  BouquetForReceiverResponse,
  BouquetLinkUrlResponse,
  BouquetLinkQuestion,
  BouquetLinkQuestionsResponse,
  BouquetQuestionAnswers,
  BouquetQuestionAnswersResponse,
  BouquetQuestionsResponse,
  BouquetShelfItem,
  BouquetShelfResponse,
  BouquetType,
  BouquetTypeListResponse,
  CompleteBouquetRequest,
  CreateBouquetRequest,
  CreateBouquetResponse,
  LandingQuestion,
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

// 로그인 사용자의 본인 꽃다발 질문 조회.
// 권한: 해당 꽃다발의 USER 발신자 또는 USER 수신자만 허용 (BE에서 검증).
export const fetchMyBouquetQuestions = async (
  baseUrl: string,
  bouquetId: number,
): Promise<LandingQuestion[]> => {
  const response = await apiRequest<BouquetQuestionsResponse>(
    baseUrl,
    `/api/v1/bouquet/${bouquetId}/questions`,
  );
  return response?.data?.questions ?? [];
};

// 비로그인 수신자가 공유 링크 토큰으로 질문 조회.
export const fetchReceiverBouquetQuestions = async (
  baseUrl: string,
  token: string,
): Promise<LandingQuestion[]> => {
  const response = await apiRequest<BouquetQuestionsResponse>(
    baseUrl,
    `/api/v1/bouquets/links/${encodeURIComponent(token)}/questions`,
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

export const fetchBouquetLinkQuestions = async (
  baseUrl: string,
  token: string,
): Promise<BouquetLinkQuestion[]> => {
  const response = await apiRequest<BouquetLinkQuestionsResponse>(
    baseUrl,
    `/api/v1/bouquets/links/${encodeURIComponent(token)}/questions`,
  );
  const data = response?.data as
    | BouquetLinkQuestionsResponse["data"]
    | BouquetLinkQuestion[]
    | undefined;

  if (Array.isArray(data)) {
    return data;
  }

  return data?.questions ?? [];
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
  const response = await apiRequest<BouquetShelfResponse>(
    baseUrl,
    "/api/v1/bouquet",
  );
  return {
    senderName: response?.data?.senderName ?? "",
    sentBouquets: response?.data?.sentBouquets ?? [],
    receivedBouquets: response?.data?.receivedBouquets ?? [],
  };
};

export const fetchBouquetAlerts = async (
  baseUrl: string,
): Promise<BouquetAlertItem[]> => {
  const response = await apiRequest<BouquetAlertsResponse>(
    baseUrl,
    "/api/v1/bouquet-completion-alerts",
  );
  return response?.data?.alerts ?? [];
};

export const readBouquetAlert = async (
  baseUrl: string,
  alertId: number,
): Promise<ApiVoidResponse> => {
  return apiRequest<ApiVoidResponse>(
    baseUrl,
    `/api/v1/bouquet-completion-alerts/${alertId}/read`,
    { method: "PATCH" },
  );
};
