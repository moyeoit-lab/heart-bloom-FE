export const bouquetKeys = {
  all: ["bouquet"] as const,
  list: (apiUrl: string | undefined) =>
    [...bouquetKeys.all, "list", apiUrl] as const,
  count: (apiUrl: string | undefined) =>
    [...bouquetKeys.all, "count", apiUrl] as const,
  shelf: (apiUrl: string | undefined) =>
    [...bouquetKeys.all, "shelf", apiUrl] as const,
  types: (apiUrl: string | undefined) =>
    [...bouquetKeys.all, "types", apiUrl] as const,
  myBouquetQuestions: (
    apiUrl: string | undefined,
    bouquetId: number | undefined,
  ) => [...bouquetKeys.all, "my-bouquet-questions", apiUrl, bouquetId] as const,
  receiverBouquetQuestions: (
    apiUrl: string | undefined,
    token: string | undefined,
  ) =>
    [...bouquetKeys.all, "receiver-bouquet-questions", apiUrl, token] as const,
  linkUrl: (apiUrl: string | undefined, bouquetId: number | undefined) =>
    [...bouquetKeys.all, "link-url", apiUrl, bouquetId] as const,
  byLink: (apiUrl: string | undefined, token: string | undefined) =>
    [...bouquetKeys.all, "by-link", apiUrl, token] as const,
  questionAnswers: (
    apiUrl: string | undefined,
    token: string | undefined,
    questionId: number | undefined,
  ) =>
    [
      ...bouquetKeys.all,
      "question-answers",
      apiUrl,
      token,
      questionId,
    ] as const,
};
