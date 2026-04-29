import { useQuery } from "@tanstack/react-query";

import {
  fetchBouquetAlerts,
  fetchBouquetByLink,
  fetchBouquetCount,
  fetchBouquetLinkQuestions,
  fetchBouquetLinkUrl,
  fetchBouquetQuestionAnswers,
  fetchBouquetShelf,
  fetchBouquetTypes,
  fetchMyBouquetQuestions,
  fetchReceiverBouquetQuestions,
} from "@/features/bouquet/api";
import { bouquetKeys } from "@/features/bouquet/keys";

export const useBouquetCountQuery = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.count(apiUrl),
    queryFn: () => fetchBouquetCount(apiUrl as string),
    enabled: Boolean(apiUrl),
  });
};

export const useBouquetAlertsQuery = (enabled = true) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.alerts(apiUrl),
    queryFn: () => fetchBouquetAlerts(apiUrl as string),
    enabled: Boolean(apiUrl) && enabled,
  });
};

export const useBouquetShelfQuery = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.list(apiUrl),
    queryFn: () => fetchBouquetShelf(apiUrl as string),
    enabled: Boolean(apiUrl),
  });
};

export const useBouquetTypesQuery = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.types(apiUrl),
    queryFn: () => fetchBouquetTypes(apiUrl as string),
    enabled: Boolean(apiUrl),
  });
};

export const useBouquetLinkUrlQuery = (bouquetId: number | undefined) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.linkUrl(apiUrl, bouquetId),
    queryFn: () => fetchBouquetLinkUrl(apiUrl as string, bouquetId as number),
    enabled: Boolean(apiUrl) && Boolean(bouquetId),
  });
};

export const useBouquetByLinkQuery = (token: string | undefined) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.byLink(apiUrl, token),
    queryFn: () => fetchBouquetByLink(apiUrl as string, token as string),
    enabled: Boolean(apiUrl) && Boolean(token),
  });
};

export const useBouquetLinkQuestionsQuery = (token: string | undefined) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.linkQuestions(apiUrl, token),
    queryFn: () => fetchBouquetLinkQuestions(apiUrl as string, token as string),
    enabled: Boolean(apiUrl) && Boolean(token),
  });
};

export const useBouquetQuestionAnswersQuery = (
  token: string | undefined,
  questionId: number | undefined,
) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.questionAnswers(apiUrl, token, questionId),
    queryFn: () =>
      fetchBouquetQuestionAnswers(
        apiUrl as string,
        token as string,
        questionId as number,
      ),
    enabled: Boolean(apiUrl) && Boolean(token) && Boolean(questionId),
  });
};

// 로그인 사용자가 본인 꽃다발의 질문 목록 조회.
export const useMyBouquetQuestionsQuery = (bouquetId: number | undefined) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.myBouquetQuestions(apiUrl, bouquetId),
    queryFn: () =>
      fetchMyBouquetQuestions(apiUrl as string, bouquetId as number),
    enabled: Boolean(apiUrl) && Boolean(bouquetId),
  });
};

// 비로그인 수신자가 공유 링크 토큰으로 질문 목록 조회.
export const useReceiverBouquetQuestionsQuery = (token: string | undefined) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.receiverBouquetQuestions(apiUrl, token),
    queryFn: () =>
      fetchReceiverBouquetQuestions(apiUrl as string, token as string),
    enabled: Boolean(apiUrl) && Boolean(token),
  });
};
