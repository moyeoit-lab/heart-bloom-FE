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
  fetchLandingQuestions,
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

export const useLandingQuestionsQuery = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useQuery({
    queryKey: bouquetKeys.landingQuestions(apiUrl),
    queryFn: () => fetchLandingQuestions(apiUrl as string),
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
